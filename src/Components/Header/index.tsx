import { Link } from "react-router-dom"

function Header(){
    return(
        <header className="flex justify-between items-center p-3 font-bold bg-fuchsia-950 text-white">
            <div className="flex flex-row gap-5">
                <div>
                    <h1>Logo</h1>
                </div>
                <nav>
                    <ul className="flex flex-row gap-5">
                        <li><a>Sobre</a></li>
                        <li><a>Serviços</a></li>
                        <li><a>Contatos</a></li>
                    </ul>
                </nav>
            </div>
            <Link to="/agendar">
                <button className="p-4 rounded text-black bg-yellow-300">Agende um horario</button>
            </Link>

        </header>
    )
}

export default Header