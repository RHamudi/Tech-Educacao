import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Slider from 'react-slick';
import 'react-datepicker/dist/react-datepicker.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import initialData from '../../db/db.json'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import qrcode from '../../assets/qrcode.png'
import Modal from 'react-modal';

type FormValues = {
    Nome: string
    Date: Date
    Profissional: string
    Servicos: string[]
    selectedTime: string;
}
interface Option {
    id: number;
    label: string;
    valor: number;
  }
  
  interface TimeSlot {
    id: number;
    time: string;
    disable: boolean
    date: string | null
  }

  interface local {
    Date: string
    Horas: string
  }
  
  interface Barber {
    horariosOcupados: TimeSlot[];
  }
  
  interface BarberData {
    options: Option[];
    barber: {
      [key: string]: Barber;
    };
  }

Modal.setAppElement('#root');
function AgendarHorario(){
    const {watch, control,register, handleSubmit, setValue, formState: error, getValues } = useForm<FormValues>({
        defaultValues: {
            Servicos: [],
            selectedTime: '',
            Profissional: 'Joao',
            Date: new Date()
        }
    });
    const formValues = getValues();
    const [db, setDb] = useState<BarberData>(initialData);
    const selectedStyle = 'p-2 rounded font-bold bg-blue-500 text-white'; // estilo para botão selecionado
    const defaultStyle = 'p-2 rounded font-bold bg-white text-black';
    const blockStyle = 'cursor-not-allowed bg-gray-600 text-black p-2 rounded';
    const selectedTime = watch('selectedTime');
    const selectedData = format(watch('Date'), 'dd/MM/yyyy')
    const profSelected = watch('Profissional');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    
    const json = localStorage.getItem(profSelected);
    let dateProf: local[] = [];
    if(json){
        dateProf = JSON.parse(json);
    }
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      };

    const onSubmit: SubmitHandler<FormValues> = (data) => {    
        console.log('tres')
        setIsOpen(true);
    }

    //Modal Configs
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

      function clickCloseModal(){
        setIsOpen(false);
      }

      function saveData() {
        let form = format(formValues.Date, "dd/MM/yyyy")

        var local = localStorage.getItem(formValues.Profissional)
        
        if(local){
            var obj = JSON.parse(local);
            localStorage.setItem(formValues.Profissional, JSON.stringify([...obj,
                {Date: form, Horas: formValues.selectedTime}
            ]))
        } else {
            localStorage.setItem(formValues.Profissional, JSON.stringify([
                {Date: form, Horas: formValues.selectedTime}
            ]))
        }
        navigate('/');
        enqueueSnackbar("Horario Agendado com sucesso", {variant: 'success'})
      }

    return (
        <>
        <section className="flex justify-center items-center bg-blue-950 h-screen">
            <form className='w-96 flex flex-col gap-10 p-10 bg-blue-900 rounded' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className='font-bold text-white'>Informe Seu Nome</label>
                    <input className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4
                    text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name'
                    type="text" placeholder="Nome" {...register("Nome", {required: true, min: 10})} />
                    {error.errors.Nome ? <p className='text-red-800 font-bold'>Por favor informe um nome</p> : <></>}
                </div>
                <div>
                    <label className='font-bold text-white'>Escolha uma data</label>
                    <Controller 
                        name='Date'
                        control={control}
                        render={({field}) => (
                            <DatePicker 
                                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4
                                text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="inline-full-name'
                                placeholderText='Escolha uma data'
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                {...field}
                                selected={field.value}
                                onChange={(date: Date | null) => field.onChange(date)}
                                onBlur={field.onBlur} // Adicionar onBlur para integração completa
                                name={field.name} // Passar o nome do campo
                                ref={field.ref} // Referência para o campo
                                value={selectedData}
                            />
                        )}
                        rules={{
                            required: "a data é obrigatoria",
                            validate: value => {
                                const select = value
                                const current = new Date();
                                current.setHours(0,0,0,0)
                                return select > current || "Não é possivel selecionar data no passado"
                            }
                        }}
                    />
                    {error.errors.Date ? <p className='text-red-800 font-bold'>{error.errors.Date.message}</p> : ""}
                </div>
                <div>
                    <label className='font-bold text-white'>Escolha Um Profissional</label>
                    <select className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 
                        px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                    {...register("Profissional", {required: true})}>
                        <option value="Joao">Joao</option>
                        <option value="Pedro">Pedro</option>
                        <option value="Marcos">Marcos</option>
                        <option value="Alex">Alex</option>
                    </select>   
                </div>
                    
                <div className='flex flex-col items-center justify-center'>
                    <h2 className='font-bold text-white'>Selecione Um ou Mais serviços</h2>
                    <ul className='w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                        {db.options.map((option) => (
                            <Controller 
                                key={option.id}
                                name='Servicos'
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <li className='w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600'>
                                        <div className='flex items-center ps-3'>
                                                <input 
                                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                    type='checkbox'
                                                    value={option.label}
                                                    checked={field.value.includes(option.label)}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if(field.value.includes(value)){
                                                            field.onChange(field.value.filter((id: string) => id !== value))
                                                        } else {
                                                            field.onChange([...field.value, value])
                                                        }
                                                    }}
                                                />
                                            <label className='w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                {option.label}
                                            </label>
                                        </div>
                                    </li>
                                )}
                            />
                        ))}
                    </ul>
                </div>

                <div>
                <label className='font-bold text-white'>Selecione Um Horario para ser atendido</label>
                <Controller 
                    name='selectedTime'
                    control={control}
                    rules={{required: true}}
                    render={({field}) => (
                        <Slider {...settings}>
                            {db.barber[profSelected].horariosOcupados.map((slot, key) => (
                                <div key={slot.id}>
                                    <button
                                        //{${dateProf.some(item => item.Date == selectedData && item.Horas == slot.time) ? 'cursor-not-allowed bg-gray-600' : ''}}
                                        className={`${selectedTime === slot.time ? selectedStyle : dateProf.some(item => item.Date == selectedData && item.Horas == slot.time) ? blockStyle : defaultStyle} `}
                                        disabled={dateProf.some(item => item.Date == selectedData && item.Horas == slot.time)}
                                        //className={`p-2 rounded font-bold ${selectedTime === slot.time ? selectedStyle : defaultStyle}`}
                                        type='button'
                                        onClick={() => { 
                                            setValue('selectedTime', slot.time)
                                        }}
                                    >
                                        {slot.time}
                                    </button>
                                </div>
                            ))}
                        </Slider>
                    )}
                />
                </div>
                <input className='p-4 rounded text-black bg-yellow-300 font-bold' type="submit" value={"Agendar"} />
            </form>
        </section>
        <Modal
            isOpen={modalIsOpen}
            //onAfterOpen={afterOpenModal}
            onRequestClose={clickCloseModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className='gap-7 flex flex-col justify-center items-center'>
                <p className='font-bold'>Pra Finalizar seu agendamento realize o pagamento de 5 Reais</p>
                <img src={qrcode} className='w-80'/>
                <button className='p-4 rounded text-black bg-yellow-300' onClick={saveData}>Realizei o pagamento</button>
            </div>
        </Modal>
        </>
    )
}

export default AgendarHorario