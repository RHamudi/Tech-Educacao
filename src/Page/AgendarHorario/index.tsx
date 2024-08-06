import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Slider from 'react-slick';
import 'react-datepicker/dist/react-datepicker.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import initialData from '../../db/db.json'
import { useState } from 'react';

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
  }
  
  interface Barber {
    horariosOcupados: string[];
  }
  
  interface BarberData {
    options: Option[];
    timeSlots: TimeSlot[];
    barber: {
      [key: string]: Barber;
    };
  }
function AgendarHorario(){
    const {watch, control,register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
        defaultValues: {
            Servicos: [],
            selectedTime: ''
        }
    });
    const [db, setDb] = useState<BarberData>(initialData);
    const selectedStyle = 'bg-blue-500 text-white'; // estilo para botão selecionado
    const defaultStyle = 'bg-white text-black';
    const selectedTime = watch('selectedTime');

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      };

    //const onSubmit = (data: FormValues) => console.log(data);
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("submit")
        setDb((prevState) => {
            if(!prevState.barber[data.Profissional].horariosOcupados.includes(data.selectedTime)){
                const updateData = {...prevState};
                updateData.barber[data.Profissional].horariosOcupados = [...prevState.barber[data.Profissional].horariosOcupados, data.selectedTime]
                return updateData
            }
            return prevState
        })
        console.log(db)
    }

    return (
        <>
        <section className="flex justify-center items-center bg-blue-950 h-screen">
            <form className='w-96  flex flex-col gap-10 p-10 bg-blue-900 rounded' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className='font-bold'>Informe Seu Nome</label>
                    <input className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4
                    text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name'
                    type="text" placeholder="Nome" {...register("Nome", {required: true, min: 10})} />
                </div>
                <div>
                    <label className='font-bold'>Escolha uma data</label>
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
                            />
                        )}
                        rules={{required: "a data é obrigatoria"}}
                    />
                </div>
                <div>
                    <label className='font-bold'>Escolha Um Profissional</label>
                    <select className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 
                        px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                    {...register("Profissional")}>
                        <option value="Joao">Joao</option>
                        <option value="Pedro">Pedro</option>
                        <option value="Marcos">Marcos</option>
                        <option value="Alex">Alex</option>
                    </select>   
                </div>
                    
                <div>
                    <h2 className='font-bold'>Selecione Um ou Mais serviços</h2>
                    <ul className='w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                        {db.options.map((option) => (
                            <Controller 
                                key={option.id}
                                name='Servicos'
                                control={control}
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
                <label className='font-bold'>Selecione Um Horario para ser atendido</label>
                <Controller 
                    name='selectedTime'
                    control={control}
                    render={({field}) => (
                        <Slider {...settings}>
                            {db.timeSlots.map((slot) => (
                                <div key={slot.id}>
                                    <button
                                        className={`p-2 rounded font-bold ${
                                        selectedTime === slot.time ? selectedStyle : defaultStyle
                                        }`}
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
        </>
    )
}

export default AgendarHorario