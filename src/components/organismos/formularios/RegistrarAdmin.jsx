import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { InputText } from "./InputText";
import { Btnsave } from "../../moleculas/Btnsave";
import { useUsuariosStore } from "../../../store/UsuariosStore";
import { ConvertirCapitalize } from "../../../utils/Conversiones";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../../supabase/supabase.config";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

export function RegistrarAdmin({ setState }) {
  const { InsertarUsuarios } = useUsuariosStore();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empresa")
        .select("id, nombre")
        .order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      tipo_usuario: "empleado",
      tipo_doc: "CC",
    },
  });

  async function insertar(data) {
    setErrorMsg("");

    const empresaId = parseInt(data.id_empresa);
    if (!empresaId) {
      setErrorMsg("Debes seleccionar una empresa.");
      return;
    }

    const parametrosAuth = {
      correo: data.correo,
      pass: data.pass,
    };

    const p = {
      nombre:       ConvertirCapitalize(data.nombre),
      correo:       data.correo,
      tipo_usuario: data.tipo_usuario,
      telefono:     data.telefono,
      direccion:    data.direccion,
      id_empresa:   empresaId,
    };

    const result = await InsertarUsuarios(parametrosAuth, p, []);

    if (result) {
      navigate("/");
    } else {
      setErrorMsg("Error al registrar el usuario. Verifica los datos.");
    }
  }

  return (
    <Container>
      <ContentClose>
        <span onClick={setState}>x</span>
      </ContentClose>

      <section className="subcontainer">
        <div className="headers">
          <h1><b>Registrar usuario</b></h1>
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
                  style={{ textTransform: "lowercase" }}
                  {...register("correo", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                  })} />
                <label className="form__label">Correo Electrónico</label>
                {errors.correo?.type === "pattern" && <p>Formato de correo incorrecto</p>}
                {errors.correo?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>

            {/* Contraseña */}
            <article>
              <InputText icono={<FaLock />}>
                <input className="form__field" type="password" placeholder=""
                  {...register("pass", { required: true, minLength: 6 })} />
                <label className="form__label">Contraseña</label>
                {errors.pass && <p>Mínimo 6 caracteres</p>}
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

            {/* Empresa */}
            <article>
              <InputText icono={<FaBuilding />}>
                <select
                  className="form__field"
                  {...register("id_empresa", { required: true })}
                  disabled={loadingEmpresas}
                >
                  <option value="">
                    {loadingEmpresas ? "Cargando empresas..." : "Selecciona una empresa"}
                  </option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre}
                    </option>
                  ))}
                </select>
                <label className="form__label">Empresa</label>
                {errors.id_empresa && <p>Debes seleccionar una empresa</p>}
              </InputText>
            </article>

            <input type="hidden" {...register("tipo_usuario")} value="empleado" />

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            <div className="btnguardarContent">
              <Btnsave
                type="submit"
                icono={<variable.iconoguardar />}
                titulo="Guardar"
                bgcolor="#2ec971"
              />
            </div>

          </section>
        </form>
      </section>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
  padding: 13px 36px 20px 36px;
  z-index: 100;
  display: flex;
  align-items: center;
  overflow-y: auto;

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

  .subcontainer {
    width: 100%;
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
  }

  .formulario {
    section {
      gap: 20px;
      display: flex;
      flex-direction: column;
    }
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: none;
    /* Cambio aquí: Gris semitransparente */
    border-bottom: 2px solid #DDE2E6; 
    outline: 0;
    font-size: 17px;
    color: #333;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    /* Opcional: Para que se vea mejor al hacer clic */
    &:focus {
      border-bottom: 2px solid #9b9b9b;
    }
  }
`;

const ContentClose = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 33px;
  margin: 30px;
  cursor: pointer;
`;