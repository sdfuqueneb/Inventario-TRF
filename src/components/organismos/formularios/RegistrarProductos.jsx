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
import { useState } from "react";
import { Btnfiltro } from "../../moleculas/Btnfiltro";
import { RegistrarMarca } from "./RegistrarMarca";
import { ListaGenerica } from "../ListaGenerica";
import { RegistrarCategoria } from "./RegistrarCategoria";

export function RegistrarProductos({ onClose, dataSelect, accion }) {
  const { InsertarProductos, editarProductos } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { marcaItemSelect, datamarca, setMarcaItemSelect } = useMarcaStore();
  const { CategoriaItemSelect, dataCategoria, setCategoriaItemSelect } = useCategoriaStore();

  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);

  const { register, formState: { errors }, handleSubmit } = useForm();

  async function insertar(data) {
    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    if (!empresaId) return;

    if (accion === "Editar") {
      await editarProductos({
        id: dataSelect?.id,
        descripcion: ConvertirCapitalize(data.nombre),
        codigobarras: data.codigobarras,
        placa: data.placa,
        preciocompra: parseFloat(data.preciocompra),
        stock: parseFloat(data.stock),
        stock_minimo: parseFloat(data.stock_minimo),
        id_marca: marcaItemSelect?.id,
        id_categoria: CategoriaItemSelect?.id,
        id_empresa: empresaId,
      });
    } else {
      await InsertarProductos({
        _codigobarras: data.codigobarras ?? "",
        _descripcion: ConvertirCapitalize(data.nombre),
        _id_categoria: CategoriaItemSelect?.id,
        _id_empresa: empresaId,
        _id_marca: marcaItemSelect?.id,
        _placa: data.placa ?? "",
        _preciocompra: parseFloat(data.preciocompra) || 0,
        _stock: parseFloat(data.stock) || 0,
        _stock_minimo: parseFloat(data.stock_minimo) || 0,
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
                <label className="form__label">Tipo</label>
                {errors.nombre?.type === "required" && <p>Campo requerido</p>}
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
                texto1="💻" texto2={marcaItemSelect?.descripcion}
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
                texto1="🏷️" texto2={CategoriaItemSelect?.descripcion}
              />
              {stateCategoria && (
                <ListaGenerica
                  setState={() => setStateCategoria(false)}
                  scroll="scroll"
                  data={dataCategoria ?? []}
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