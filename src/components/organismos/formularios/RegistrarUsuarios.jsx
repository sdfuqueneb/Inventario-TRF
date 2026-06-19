import { useState, useEffect } from "react";
import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { InputText } from "./InputText";
import { Btnsave } from "../../moleculas/Btnsave";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { ConvertirCapitalize } from "../../../utils/Conversiones";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { ListaModulos } from "../ListaModulos";

export function RegistrarUsuarios({ onClose, dataSelect, accion }) {
  const { InsertarUsuarios, editarUsuarios, mostrarModulos, cargarPermisosEditar } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();

  const [checkboxs, setCheckboxs] = useState([]);

  const { register, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      nombre:       dataSelect?.nombre       ?? "",
      correo:       dataSelect?.correo       ?? "",
      tipo_usuario: dataSelect?.tipo_usuario ?? "empleado",
      numero_doc:   dataSelect?.numero_doc   ?? "",
      tipo_doc:     dataSelect?.tipo_doc     ?? "CC",
      telefono:     dataSelect?.telefono     ?? "",
      direccion:    dataSelect?.direccion    ?? "",
    }
  });

  useEffect(() => {
    mostrarModulos();
    if (accion === "Editar" && dataSelect?.id) {
      cargarPermisosEditar(dataSelect.id);
    }
  }, []);

  async function insertar(data) {
    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    if (!empresaId) {
      console.error("Error: No se encontró el ID de la empresa.");
      return;
    }

    if (accion === "Editar") {
      await editarUsuarios(
        {
          id:           dataSelect?.id,
          nombre:       ConvertirCapitalize(data.nombre),
          correo:       data.correo,
          tipo_usuario: data.tipo_usuario,
          numero_doc:   data.numero_doc,
          tipo_doc:     data.tipo_doc,
          telefono:     data.telefono,
          direccion:    data.direccion,
        },
        checkboxs
      );
    } else {
      const parametrosAuth = { correo: data.correo, pass: data.pass };
      const p = {
        nombre:       ConvertirCapitalize(data.nombre),
        correo:       data.correo,
        tipo_usuario: data.tipo_usuario,
        numero_doc:   data.numero_doc,
        tipo_doc:     data.tipo_doc,
        telefono:     data.telefono,
        direccion:    data.direccion,
        id_empresa:   empresaId,
      };
      await InsertarUsuarios(parametrosAuth, p, checkboxs);
    }
    onClose();
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion === "Editar" ? "Editar Usuario" : "Registrar nuevo Usuario"}</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <div className="layout-dos-columnas">

            <div className="columna-campos">

              <article>
                <InputText icono={<FaUser />}>
                  <input className="form__field" type="text" placeholder=""
                    {...register("nombre", { required: true })} />
                  <label className="form__label">Nombre Completo</label>
                  {errors.nombre && <p>Campo requerido</p>}
                </InputText>
              </article>

              <article>
                <InputText icono={<FaEnvelope />} $bloqueado={accion === "Editar"}>
                  <input
                    className="form__field"
                    type="email"
                    placeholder=""
                    readOnly={accion === "Editar"}
                    {...register("correo", { required: true })}
                  />
                  <label className="form__label">
                    Correo Electrónico
                    {accion === "Editar" && <span className="lock-hint"> · no editable</span>}
                  </label>
                  {errors.correo && <p>Campo requerido</p>}
                </InputText>
              </article>

              {accion !== "Editar" && (
                <article>
                  <InputText icono={<FaLock />}>
                    <input className="form__field" type="password" placeholder=""
                      {...register("pass", { required: true, minLength: 6 })} />
                    <label className="form__label">Contraseña</label>
                    {errors.pass && <p>Mínimo 6 caracteres</p>}
                  </InputText>
                </article>
              )}

              <article>
                <InputText icono={<FaIdCard />}>
                  <select className="form__field" {...register("tipo_doc", { required: true })}>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PA">Pasaporte</option>
                    <option value="NIT">NIT</option>
                  </select>
                  <label className="form__label">Tipo de Documento</label>
                </InputText>
              </article>

              <article>
                <InputText icono={<FaIdCard />}>
                  <input className="form__field" type="text" placeholder=""
                    {...register("numero_doc")} />
                  <label className="form__label">Número de Documento</label>
                </InputText>
              </article>

              <article>
                <InputText icono={<FaPhone />}>
                  <input className="form__field" type="text" placeholder=""
                    {...register("telefono")} />
                  <label className="form__label">Teléfono</label>
                </InputText>
              </article>

              <article>
                <InputText icono={<FaMapMarkerAlt />}>
                  <input className="form__field" type="text" placeholder=""
                    {...register("direccion")} />
                  <label className="form__label">Dirección</label>
                </InputText>
              </article>

              <article>
                <InputText icono={<FaUser />}>
                  <select className="form__field" {...register("tipo_usuario", { required: true })}>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <label className="form__label">Tipo de Usuario</label>
                </InputText>
              </article>

            </div>

            <div className="columna-permisos">
              <p className="label-permisos">Permisos</p>
              <ListaModulos
                checkboxs={checkboxs}
                setCheckboxs={setCheckboxs}
                accion={accion}
              />
            </div>

          </div>

          <div className="btnguardarContent">
            <Btnsave
              icono={<variable.iconoguardar />}
              titulo="Guardar"
              bgcolor="#2ec971"
              type="submit"
            />
          </div>

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
  z-index: 1100;

  .sub-contenedor {
    width: 850px;
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      h1 { font-size: 20px; font-weight: 500; }
      span { font-size: 20px; cursor: pointer; }
    }
  }

  .layout-dos-columnas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }

  .columna-campos {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .columna-permisos {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: sticky;
    top: 0;

    .label-permisos {
      font-size: 0.875em;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
    }
  }

  .btnguardarContent {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }

  /* Hint de campo bloqueado */
  .lock-hint {
    font-size: 0.75em;
    opacity: 0.5;
    font-weight: 400;
    margin-left: 4px;
  }
`;