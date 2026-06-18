import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { InputText } from "./InputText";
import { Btnsave } from "../../moleculas/Btnsave";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { ConvertirCapitalize } from "../../../utils/Conversiones";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { FaUser, FaSave, FaEnvelope, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export function RegistrarUsuarios({ onClose, dataSelect, accion }) {
  const { InsertarUsuarios, editarUsuarios } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();

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

  async function insertar(data) {
    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    if (!empresaId) {
      console.error("Error: No se encontró el ID de la empresa.");
      return;
    }

    if (accion === "Editar") {
      await editarUsuarios({
        id:           dataSelect?.id,
        nombre:       ConvertirCapitalize(data.nombre),
        correo:       data.correo,
        tipo_usuario: data.tipo_usuario,
        numero_doc:   data.numero_doc,
        tipo_doc:     data.tipo_doc,
        telefono:     data.telefono,
        direccion:    data.direccion,
      });
    } else {
      const parametrosAuth = {
        correo: data.correo,
        pass:   data.pass,
      };
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
      await InsertarUsuarios(parametrosAuth, p, []);
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
          <section>

            {/* Nombre */}
            <article>
              <InputText icono={<FaUser />}>
                <input className="form__field" type="text" placeholder=""
                  {...register("nombre", { required: true })} />
                <label className="form__label">Nombre Completo</label>
                {errors.nombre && <p>Campo requerido</p>}
              </InputText>
            </article>

            {/* Correo */}
            <article>
              <InputText icono={<FaEnvelope />}>
                <input className="form__field" type="email" placeholder=""
                  {...register("correo", { required: true })} />
                <label className="form__label">Correo Electrónico</label>
                {errors.correo && <p>Campo requerido</p>}
              </InputText>
            </article>

            {/* Contraseña — solo al registrar */}
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

            {/* Tipo documento */}
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

            {/* Número documento */}
            <article>
              <InputText icono={<FaIdCard />}>
                <input className="form__field" type="text" placeholder=""
                  {...register("numero_doc")} />
                <label className="form__label">Número de Documento</label>
              </InputText>
            </article>

            {/* Teléfono */}
            <article>
              <InputText icono={<FaPhone />}>
                <input className="form__field" type="text" placeholder=""
                  {...register("telefono")} />
                <label className="form__label">Teléfono</label>
              </InputText>
            </article>

            {/* Dirección */}
            <article>
              <InputText icono={<FaMapMarkerAlt />}>
                <input className="form__field" type="text" placeholder=""
                  {...register("direccion")} />
                <label className="form__label">Dirección</label>
              </InputText>
            </article>

            {/* Tipo usuario */}
            <article>
              <InputText icono={<FaUser />}>
                <select className="form__field" {...register("tipo_usuario", { required: true })}>
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
                <label className="form__label">Tipo de Usuario</label>
              </InputText>
            </article>

            <div className="btnguardarContent">
              <Btnsave
                icono={<variable.iconoguardar />}
                titulo="Guardar"
                bgcolor="#2ec971"
                type="submit"
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
  z-index: 1100;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    max-height: 90vh;
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
      h1 { font-size: 20px; font-weight: 500; }
      span { font-size: 20px; cursor: pointer; }
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