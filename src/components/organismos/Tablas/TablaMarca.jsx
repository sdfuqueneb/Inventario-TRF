import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import styled from "styled-components";
import { ContentAccionesTabla } from "../ContentAccionesTabla";
import Swal from "sweetalert2";
import { useMarcaStore } from "../../../store/MarcaStore";

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
            confirmButtonText: "Sí, eliminar"
        }).then(async(result) => {
        if (result.isConfirmed) {
            await eliminarMarca({id:p.id})
        }
    });
    }
    const columns = [{
        accessorKey: "descripcion",
        header: "Descripcion",
        cell: (info) => <span>{info.getValue()}</span>
    },
    {
        accessorKey: "acciones",
        header: "Acciones",
        cell: (info) => (<td>
            <ContentAccionesTabla 
                funcionEditar={() => editar(info.row.original)}
                funcionEliminar={() => eliminar(info.row.original)}
            />
        </td>)
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
        <table>
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

`