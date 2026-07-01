import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { InputText } from "./InputText";
import { Btnsave } from "../../moleculas/Btnsave";
import { useProductosStore } from "../../../store/ProductosStore";
import { ConvertirCapitalize } from "../../../utils/Conversiones";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { ContainerSelector } from "../../atomos/ContainerSelector";
import { Selector } from "../Selector";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriaStore } from "../../../store/CategoriaStore";
import { useState, useEffect, useMemo } from "react"; 
import { ListaGenerica } from "../ListaGenerica";
import { useUsuariosStore } from "../../../store/UsuariosStore";

export function RegistrarProductos({ onClose, dataSelect, accion }) {
  const { InsertarProductos, editarProductos } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { marcaItemSelect, datamarca, setMarcaItemSelect } = useMarcaStore();
  const { CategoriaItemSelect, datacategoria, dataCategoria, setCategoriaItemSelect } = useCategoriaStore();
  
  const { dataUsuarios, mostrarUsuariosTodos } = useUsuariosStore(); 

  const [asignacionItemSelect, setAsignacionItemSelect] = useState(null);
  const [stateAsignacion, setStateAsignacion] = useState(false);

  const idEmpresaActiva = dataempresa?.id ?? dataempresa?.[0]?.id;

  const listaAsignaciones = useMemo(() => {
    return [
      { id: "bodega", descripcion: "Bodega" },
      ...(dataUsuarios || []).map((u) => {
        let nombreUsuario = "";
        if (u.correo) {
          nombreUsuario = u.correo.split("@")[0];
        } else {
          nombreUsuario = u.nombres || u.nombre || "Usuario sin nombre";
        }

        return { 
          id: u.id, 
          descripcion: nombreUsuario
        };
      })
    ];
  }, [dataUsuarios]);

  const lasCategorias = dataCategoria ?? datacategoria ?? [];

  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);

  const { register, formState: { errors }, handleSubmit } = useForm();

  useEffect(() => {
    const cargarUsuarios = async () => {
      if (idEmpresaActiva && mostrarUsuariosTodos) {
        await mostrarUsuariosTodos({ id_empresa: idEmpresaActiva });
      }
    };
    cargarUsuarios();
  }, [idEmpresaActiva, mostrarUsuariosTodos]);

  useEffect(() => {
    if (accion !== "Editar") {
      setMarcaItemSelect(null);
      setCategoriaItemSelect(null);
      setAsignacionItemSelect(null);
    }
  }, [accion, setMarcaItemSelect, setCategoriaItemSelect]);

  async function insertar(data) {
    if (!idEmpresaActiva) return;

    const idMarcaFinal = marcaItemSelect?.id ?? dataSelect?.id_marca;
    const idCategoriaFinal = CategoriaItemSelect?.id ?? dataSelect?.id_categoria;
    const asignacionFinal = asignacionItemSelect?.descripcion || dataSelect?.asignacion || "Bodega";

    if (!idMarcaFinal || !idCategoriaFinal) {
      alert("Por favor, seleccione una Marca y una Categoría válidas antes de guardar.");
      return;
    }

    if (accion === "Editar") {
      await editarProductos({
        id: dataSelect?.id,
        descripcion: ConvertirCapitalize(data.nombre),
        codigobarras: data.codigobarras,
        modelo: data.modelo ?? "",
        placa: data.placa,
        preciocompra: parseFloat(data.preciocompra) || 0,
        stock: parseFloat(data.stock) || 0,
        stock_minimo: parseFloat(data.stock_minimo) || 0,
        id_marca: Number(idMarcaFinal),
        id_categoria: Number(idCategoriaFinal),
        id_empresa: Number(idEmpresaActiva),
        asignacion: asignacionFinal,
      });
    } else {
      await InsertarProductos({
        codigobarras: data.codigobarras ?? "",
        descripcion: ConvertirCapitalize(data.nombre),
        modelo: data.modelo ?? "",
        id_categoria: Number(idCategoriaFinal),
        id_empresa: Number(idEmpresaActiva),
        id_marca: Number(idMarcaFinal),
        placa: data.placa ?? "",
        preciocompra: parseFloat(data.preciocompra) || 0,
        stock: parseFloat(data.stock) || 0,
        stock_minimo: parseFloat(data.stock_minimo) || 0,
        asignacion: asignacionFinal,
      });
    }
    onClose();
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion === "Editar" ? "Editar Producto" : "Registrar Producto"}</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>

            <article>
              <InputText icono={<variable.icononombre />}>
                <input className="form__field" defaultValue={dataSelect?.descripcion ?? ""}
                  type="text" placeholder=""
                  {...register("nombre", { required: true })}
                />
                <label className="form__label">Tipo / Producto</label>
                {errors.nombre?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>

            <article>
              <InputText icono={<variable.icononombre />}> 
                <input className="form__field" defaultValue={dataSelect?.modelo ?? ""}
                  type="text" placeholder=""
                  {...register("modelo")} 
                />
                <label className="form__label">Modelo</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<variable.iconocodigobarras />}>
                <input className="form__field" defaultValue={dataSelect?.codigobarras ?? ""}
                  type="text" placeholder=""
                  {...register("codigobarras")}
                />
                <label className="form__label">Serial fabricante</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<variable.iconocodigointerno />}>
                <input className="form__field" defaultValue={dataSelect?.placa ?? ""}
                  type="text" placeholder=""
                  {...register("placa")}
                />
                <label className="form__label">Placa</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<variable.iconopreciocompra />}>
                <input className="form__field" defaultValue={dataSelect?.preciocompra ?? ""}
                  type="number" step="0.01" placeholder=""
                  {...register("preciocompra")}
                />
                <label className="form__label">Precio</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<variable.iconostock />}>
                <input className="form__field" defaultValue={dataSelect?.stock ?? ""}
                  type="number" placeholder=""
                  {...register("stock")}
                />
                <label className="form__label">Stock</label>
              </InputText>
            </article>

            <article>
              <InputText icono={<variable.iconostockminimo />}>
                <input className="form__field" defaultValue={dataSelect?.stock_minimo ?? ""}
                  type="number" placeholder=""
                  {...register("stock_minimo")}
                />
                <label className="form__label">Stock mínimo</label>
              </InputText>
            </article>

            <ContainerSelector>
              <label>Marca: </label>
              <Selector
                funcion={() => { setStateMarca(!stateMarca); setStateCategoria(false); setStateAsignacion(false); }}
                state={stateMarca} color="#2EC971"
                texto1="💻" 
                texto2={marcaItemSelect?.descripcion || dataSelect?.marca || "Seleccione una marca..."}
              />
              {stateMarca && (
                <ListaGenerica
                  setState={() => setStateMarca(false)}
                  scroll="scroll"
                  data={datamarca ?? []}
                  funcion={(item) => { setMarcaItemSelect(item); setStateMarca(false); }}
                />
              )}
            </ContainerSelector>

            <ContainerSelector>
              <label>Categoría: </label>
              <Selector
                funcion={() => { setStateCategoria(!stateCategoria); setStateMarca(false); setStateAsignacion(false); }}
                state={stateCategoria} color="#2EC971"
                texto1="🏷️" 
                texto2={CategoriaItemSelect?.descripcion || dataSelect?.categoria || "Seleccione una categoría..."}
              />
              {stateCategoria && (
                <ListaGenerica
                  setState={() => setStateCategoria(false)}
                  scroll="scroll"
                  data={lasCategorias}
                  funcion={(item) => { setCategoriaItemSelect(item); setStateCategoria(false); }}
                />
              )}
            </ContainerSelector>

            <ContainerSelector>
              <label>Asignación: </label>
              <Selector
                funcion={() => { setStateAsignacion(!stateAsignacion); setStateMarca(false); setStateCategoria(false); }}
                state={stateAsignacion} color="#2EC971"
                texto1="👤" 
                texto2={asignacionItemSelect?.descripcion || dataSelect?.asignacion || "Bodega"}
              />
              {stateAsignacion && (
                <ListaGenerica
                  setState={() => setStateAsignacion(false)}
                  scroll="scroll"
                  data={listaAsignaciones}
                  funcion={(item) => { setAsignacionItemSelect(item); setStateAsignacion(false); }}
                />
              )}
            </ContainerSelector>

            <div className="btnguardarContent">
              <Btnsave
                icono={<variable.iconoguardar />}
                titulo="Guardar" bgcolor="#2ec971" type="submit"
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
  padding: 20px 0;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }

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
    .formulario {
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;