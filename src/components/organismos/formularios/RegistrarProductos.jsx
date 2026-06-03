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
import { useState, useEffect } from "react";
import { Btnfiltro } from "../../moleculas/Btnfiltro";
import { RegistrarMarca } from "./RegistrarMarca";
import { ListaGenerica } from "../ListaGenerica";
import { RegistrarCategoria } from "./RegistrarCategoria";

export function RegistrarProductos({ onClose, dataSelect, accion }) {
  const { InsertarProductos, editarProductos } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  
  const { marcaItemSelect, datamarca, setMarcaItemSelect } = useMarcaStore();
  const { CategoriaItemSelect, datacategoria, dataCategoria, setCategoriaItemSelect } = useCategoriaStore();

  const lasCategorias = dataCategoria ?? datacategoria ?? [];

  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);

  const { register, formState: { errors }, handleSubmit } = useForm();

  useEffect(() => {
    if (accion !== "Editar") {
      setMarcaItemSelect(null);
      setCategoriaItemSelect(null);
    }
  }, [accion]);

  async function insertar(data) {
    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    if (!empresaId) return;

    const idMarcaFinal = marcaItemSelect?.id ?? dataSelect?.id_marca;
    const idCategoriaFinal = CategoriaItemSelect?.id ?? dataSelect?.id_categoria;

    if (!idMarcaFinal || !idCategoriaFinal) {
      alert("Por favor, seleccione una Marca y una Categoría válidas antes de guardar.");
      return;
    }

    if (accion === "Editar") {
      await editarProductos({
        id: dataSelect?.id,
        descripcion: ConvertirCapitalize(data.nombre),
        codigobarras: data.codigobarras,
        modelo: data.modelo ?? "", // <--- 1. AGREGADO EN EDICIÓN
        placa: data.placa,
        preciocompra: parseFloat(data.preciocompra) || 0,
        stock: parseFloat(data.stock) || 0,
        stock_minimo: parseFloat(data.stock_minimo) || 0,
        id_marca: Number(idMarcaFinal),
        id_categoria: Number(idCategoriaFinal),
        id_empresa: Number(empresaId),
      });
    } else {
      await InsertarProductos({
        codigobarras: data.codigobarras ?? "",
        descripcion: ConvertirCapitalize(data.nombre),
        modelo: data.modelo ?? "", // <--- 1. AGREGADO EN INSERCIÓN
        id_categoria: Number(idCategoriaFinal),
        id_empresa: Number(empresaId),
        id_marca: Number(idMarcaFinal),
        placa: data.placa ?? "",
        preciocompra: parseFloat(data.preciocompra) || 0,
        stock: parseFloat(data.stock) || 0,
        stock_minimo: parseFloat(data.stock_minimo) || 0,
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

            {/* 3. BLOQUE DE INPUT PARA MODELO AGREGADO AQUÍ */}
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
                funcion={() => { setStateMarca(!stateMarca); setStateCategoria(false); }}
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
                funcion={() => { setStateCategoria(!stateCategoria); setStateMarca(false); }}
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
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
  }
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  svg {
    font-size: 25px;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 40px;
    font-size: 28px;
  }
`;

const ContainerEmojiPicker = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;