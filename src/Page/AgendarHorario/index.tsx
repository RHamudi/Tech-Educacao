import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Slider from 'react-slick';
import 'react-datepicker/dist/react-datepicker.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

type FormValues = {
    Nome: string
    Date: Date
    Profissional: string
    Servicos: string[]
    selectedTime: string | null;
}
interface TimeSlot {
    id: number;
    time: string;
  }

const options = [
    { id: '1', label: "Cabelo"},
    { id: '2', label: "Barba"},
    { id: '3', label: "Sombrancelha"},
]


const timeSlots: TimeSlot[] = [
    { id: 1, time: "08:00 AM" },
    { id: 2, time: "09:00 AM" },
    { id: 3, time: "10:00 AM" },
    { id: 4, time: "11:00 AM" },
    { id: 5, time: "12:00 PM" },
    { id: 6, time: "01:00 PM" },
    { id: 7, time: "02:00 PM" },
    { id: 8, time: "03:00 PM" }
];

function AgendarHorario(){

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      };

    const { control ,register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
        defaultValues: {
            Servicos: [],
            selectedTime: null
        }
    });
    //const onSubmit = (data: FormValues) => console.log(data);
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
        console.log(errors);
    }

    return (
        <>
        <section className="flex justify-center items-center bg-blue-950 h-screen">
            <form className='w-96 flex flex-col gap-10' onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Nome" {...register("Nome", {required: true, min: 10})} />
                <Controller 
                    name='Date'
                    control={control}
                    render={({field}) => (
                        <DatePicker 
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
                <select {...register("Profissional")}>
                    <option value="Joao">Joao</option>
                    <option value=" Pedro"> Pedro</option>
                    <option value=" Marcos"> Marcos</option>
                    <option value=" Alex"> Alex</option>
                </select>   
                    
                <div>
                    {options.map((option) => (
                        <Controller 
                            key={option.id}
                            name='Servicos'
                            control={control}
                            render={({field}) => (
                                <label>
                                    <input 
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
                                    {option.label}
                                </label>
                            )}
                        />
                    ))}
                </div>

                <div>
                <Controller 
                    name='selectedTime'
                    control={control}
                    render={({field}) => (
                        <Slider {...settings}>
                            {timeSlots.map((slot) => (
                                <div key={slot.id}>
                                    <button
                                        type='button'
                                        onClick={() => setValue('selectedTime', slot.time)}
                                    >
                                        {slot.time}
                                    </button>
                                </div>
                            ))}
                        </Slider>
                    )}
                />
                </div>
                

                <div>
                    <input type="submit" />
                </div>
            </form>
        </section>
        </>
    )
}

export default AgendarHorario