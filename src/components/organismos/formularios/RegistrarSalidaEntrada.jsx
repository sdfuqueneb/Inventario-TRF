import { useState } from "react";
import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { InputText } from "./InputText";
import { Btnsave } from "../../moleculas/Btnsave";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { useProductosStore } from "../../../store/ProductosStore";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useKardexStore } from "../../../store/KardexStore";

export function RegistrarSalidaEntrada({ onClose, dataSelect, accion, tipo }) {
  const { idusuario } = useUsuariosStore();
  const [stateListaProd, SetstateListaProd] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const { dataproductos, productoItemSelect, selectProductos, setBuscador } =
    useProductosStore();

  const { insertarKardex } = useKardexStore();
  const { dataempresa } = useEmpresaStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleBuscarProducto = (e) => {
    const valor = e.target.value;
    setTextoBusqueda(valor);
    setBuscador(valor);
    SetstateListaProd(true);
  };

  const handleSelectProducto = (producto) => {
    selectProductos(producto);
    setTextoBusqueda(producto.descripcion);
    SetstateListaProd(false);
  };

  async function insertar(data) {
    if (accion === "Editar") {
      // pendiente: lógica de edición de movimiento existente
    } else {
      const p = {
        fecha: new Date(),
        tipo: tipo,
        id_usuario: idusuario,
        id_producto: productoItemSelect.id,
        cantidad: parseFloat(data.cantidad),
        detalle: data.detalle,
        id_empresa: dataempresa.id,
      };
      await insertarKardex(p);
      onClose();
    }
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion == "Editar" ? "Editar movimiento" : "Registrar " + tipo}</h1>
          </section>

          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <div className="contentBuscador">
          <InputText icono={<variable.iconobuscar />}>
            <input
              className="form__field"
              type="text"
              placeholder=""
              value={textoBusqueda}
              onChange={handleBuscarProducto}
              onFocus={() => SetstateListaProd(true)}
            />
            <label className="form__label">Buscar producto</label>
          </InputText>

          {stateListaProd && dataproductos?.length > 0 && (
            <ListaProductos>
              {dataproductos.map((producto) => (
                <li
                  key={producto.id}
                  onClick={() => handleSelectProducto(producto)}
                >
                  {producto.descripcion}
                </li>
              ))}
            </ListaProductos>
          )}
        </div>

        <CardProducto>
          <span style={{ color: "#1fee61", fontWeight: "bold" }}>
            {productoItemSelect?.descripcion}
          </span>
          <span style={{ color: "#f6faf7" }}>
            stock actual: {productoItemSelect?.stock}
          </span>
        </CardProducto>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            <article>
              <InputText icono={<variable.iconomarca />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.cantidad}
                  type="text"
                  placeholder=""
                  {...register("cantidad", {
                    required: true,
                  })}
                />
                <label className="form__label">Cantidad</label>
                {errors.cantidad?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<variable.iconomarca />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.detalle}
                  type="text"
                  placeholder=""
                  {...register("detalle", {
                    required: true,
                  })}
                />
                <label className="form__label">Motivo</label>
                {errors.detalle?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>

            <div className="btnguardarContent">
              <Btnsave
                icono={<variable.iconoguardar />}
                titulo="Guardar"
                bgcolor="#ef552b"
              />
            </div>
          </section>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .contentBuscador {
      position: relative;
    }
    .formulario {
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;

const ListaProductos = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 6px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgtotal};
  border: 0.5px solid ${({ theme }) => theme.bg2};
  box-shadow: 0px 10px 20px rgba(10, 9, 9, 0.25);
  z-index: 50;

  li {
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: ${({ theme }) => theme.bg3};
    }
  }
`;

const CardProducto = styled.section`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  border: 1px dashed #54f04f;
  background-color: rgba(84, 240, 79, 0.1);
  padding: 10px;
`;