import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import styled from "styled-components";
import { ContentAccionesTabla } from "../ContentAccionesTabla";
import Swal from "sweetalert2";
import { useMarcaStore } from "../../../store/MarcaStore";
import { variable } from "../../../styles/variables";

export function TablaMarca({data}) {
    const {eliminarMarca} = useMarcaStore();
    const editar = () => {

    }
    const eliminar = (p) => {
        if (p.descripcion === "Generica") {
            Swal.fire ({
                icon: "error",
                title: "No se puede realizar esta acción",
                text: "No se puede eliminar este registro al ser predeterminado del sistema.",
            });
        return;
        }
        Swal.fire({
            title: "Estás seguro de eliminar este registro?",
            text: "No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async(result) => {
        if (result.isConfirmed) {
            await eliminarMarca({id:p.id})
        }
    });
    }
    const columns = [{
        accessorKey: "descripcion",
        header: "Descripción",
        cell: (info) => <span>{info.getValue()}</span>
    },
    {
        accessorKey: "acciones",
        header: "Acciones",
        cell: (info) =>(
                <ContentAccionesTabla 
                    funcionEditar={() => editar(info.row.original)}
                    funcionEliminar={() => eliminar(info.row.original)}
                    className="ContentCell"
                />)
    }]
    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return(
    <Container>
        <table className="responsive-table">
            <thead>
                {
                    table.getHeaderGroups().map((headerGroup) => (
                        <tr key = {headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key = {header.id}>
                                    {header.column.columnDef.header}
                                </th>
                            ))}
                        </tr>
                    ))
                }
            </thead>
            <tbody>
                {table.getRowModel().rows.map((item) => (
                    <tr key = {item.id}>
                        {
                            item.getVisibleCells().map((cell) => (
                                <td key = {cell.id}>
                                    {
                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                    }
                                </td>
                            ))
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    </Container>)
}

const Container = styled.div`
  position: relative;

  margin: 5% 3%;
  @media (min-width: ${variable.bpbart}) {
    margin: 2%;
  }
  @media (min-width: ${variable.bphomer}) {
    margin: 2em auto;
    /* max-width: ${variable.bphomer}; */
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${variable.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${variable.bpmarge}) {
      font-size: 1em;
    }
    thead {
      position: absolute;

      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      @media (min-width: ${variable.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    tr {
      @media (min-width: ${variable.bpbart}) {
        display: table-row;
      }
    }

    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      @media (min-width: ${variable.bplisa}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${variable.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      @media (min-width: ${variable.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${variable.bphomer}) {
        padding: 0.75em;
      }
    }
    tbody {
      @media (min-width: ${variable.bpbart}) {
        display: table-row-group;
      }
      tr {
        margin-bottom: 1em;
        @media (min-width: ${variable.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
        &:nth-of-type(even) {
          @media (min-width: ${variable.bpbart}) {
            background-color: rgba(78, 78, 78, 0.12);
          }
        }
      }
      th[scope="row"] {
        @media (min-width: ${variable.bplisa}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        }
        @media (min-width: ${variable.bpbart}) {
          background-color: transparent;
          text-align: center;
          color: ${({ theme }) => theme.text};
        }
      }
      .ContentCell {
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;

        border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        @media (min-width: ${variable.bpbart}) {
          justify-content: center;
          border-bottom: none;
        }
      }
      td {
        text-align: right;
        @media (min-width: ${variable.bpbart}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
          text-align: center;
        }
      }
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        @media (min-width: ${variable.bplisa}) {
          font-size: 0.9em;
        }
        @media (min-width: ${variable.bpbart}) {
          content: none;
        }
      }
    }
  }
`;