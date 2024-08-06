import { Link } from 'react-router-dom';
import background from '../../assets/background-1.png';

function Main(){
    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
      };

    return (
        <section>
            <div className='flex flex-col justify-center items-center gap-8' style={backgroundStyle}>
                <h1 className='text-white text-center font-extrabold text-7xl'>Transformando o seu visual com estilo e precisão.</h1>
                <h2 className='text-white font-semibold text-xl'>Hórario de funcionamento: 07:00 às 20:00</h2>
                <Link to="/agendar">
                    <button className="p-4 rounded text-black bg-yellow-300">Agende um horario</button>
                </Link>
            </div>
        </section>
    )
}

export default Main;