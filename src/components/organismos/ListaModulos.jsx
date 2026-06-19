import styled from "styled-components";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useEffect, useState } from "react";

export function ListaModulos({ checkboxs, setCheckboxs, accion }) {
  const { datamodulos, datapermisosEdit } = useUsuariosStore();
  const [isChecked, setisChecked] = useState(true);

  useEffect(() => {
    if (accion === "Editar") {
      const allDocs = datamodulos.map((element) => {
        const statePermiso = datapermisosEdit?.some((objeto) =>
          objeto.modulos.nombre.includes(element.nombre)
        );
        return { ...element, check: statePermiso ?? false };
      });
      setCheckboxs(allDocs);
    } else {
      const allDocs = datamodulos.map((element) => ({
        ...element,
        check: false,
      }));
      setCheckboxs(allDocs);
    }
  }, [datamodulos, datapermisosEdit]);

  const handlecheckbox = (id) => {
    setCheckboxs((prev) =>
      prev?.map((item) =>
        item.id === id ? { ...item, check: !item.check } : { ...item }
      )
    );
  };

  const seleccionar = (e) => {
    setisChecked(e.target.checked);
  };

  return (
    <Container>
      {checkboxs?.map((item, index) => (
        <div
          className="content"
          key={index}
          onClick={() => handlecheckbox(item.id)}
        >
          <input
            checked={item.check}
            className="checkbox"
            type="checkbox"
            onChange={seleccionar}
          />
          <span>{item.nombre}</span>
        </div>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px dashed #414244;
  border-radius: 15px;
  padding: 20px;
  gap: 15px;

  .content {
    display: flex;
    gap: 20px;
  }

  .checkbox {
    appearance: none;
    overflow: hidden;
    min-width: 30px;
    aspect-ratio: 1/1;
    border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;
    border: 2px solid #012452;
    position: relative;
    transition: all 0.2s ease-in-out;
    &::before {
      position: absolute;
      inset: 0;
      content: "";
      font-size: 35px;
      transition: all 0.2s ease-in-out;
    }
    &:checked {
      border: 2px solid #9FE9BF;
      background: linear-gradient(
        135deg,
        #55D88E,
        #27AA60
      );
      box-shadow: -5px -5px 30px #55D88E,
        5px 5px 30px #27AA60;
      &::before {
        background: linear-gradient(
          135deg,
          #55D88E,
          #27AA60
        );
      }
    }
  }
`;