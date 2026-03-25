import { variable } from "../styles/variables"; 
import {
  AiOutlineHome,
  AiOutlineSetting,
} from "react-icons/ai";

export const DesplegableUser = [
  {
    text: "Mi perfil",
    icono: <variable.iconoUser/>,
    tipo: "miperfil",
  },
  {
    text: "Configuración",
    icono: <variable.iconoSettings/>,
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: <variable.iconoCerrarSesion/>,
    tipo: "cerrarsesion",
  },
];

//data SIDEBAR
export const LinksArray = [
  {
    label: "Home",
    icon: <AiOutlineHome />,
    to: "/",
  },
  {
    label: "Kardex",
    icon: <variable.iconocategorias />,
    to: "/kardex",
  },
  {
    label: "Reportes",
    icon: <variable.iconoreportes />,
    to: "/reportes",
  },
 
];
export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: <AiOutlineSetting />,
    to: "/configurarcuenta",
  },

];
//temas
export const TemasData = [
  {
    icono: "☀️",
    descripcion: "light",
   
  },
  {
    icono: "🌙",
    descripcion: "dark",
    
  },
];

//data configuracion
export const DataModulosConfiguracion =[
  {
    title:"Productos",
    subtitle:"Cargar inventario",
    icono:"https://i.ibb.co/w86RLHz/monitor.png",
    link:"/configurarcuenta/productos",
    state: true,
  },
  {
    title:"Personal",
    subtitle:"Controla accesos y actividades",
    icono:"https://i.ibb.co/mrcKqXbr/personal.png",
    link:"/configurarcuenta/usuarios",
    state: true,
  },

  {
    title:"Tu empresa",
    subtitle:"Prepara tu espacio de trabajo",
    icono:"https://i.ibb.co/qFcBK4gd/tr-imagen.png",
    link:"/configurarcuenta/empresa",
    state: true,
  },
  {
    title:"Categoría de productos",
    subtitle:"Organizar por categorías",
    icono:"https://i.ibb.co/1GzK0Qsj/combo.png",
    link:"/configurarcuenta/categorias",
    state: true,
  },
  {
    title:"Marca de productos",
    subtitle:"Control de marcas",
    icono:"https://i.ibb.co/XrCdZMWL/lenovo.png",
    link:"/configurarcuenta/marca",
    state: true,
  },

]
//tipo usuario
export const TipouserData = [
  {
    descripcion: "Colaborador",
    icono: "👨‍💼",
  },
  {
    descripcion: "Administrador",
    icono: "👩‍💻",
  },
];

//tipodoc
export const TipoDocData = [
  {
    descripcion: "CC",
    icono: "🪪",
  },
  {
    descripcion: "Pasaporte",
    icono: "📖",
  },
  {
    descripcion: "Otros",
    icono: "👤",
  },
];