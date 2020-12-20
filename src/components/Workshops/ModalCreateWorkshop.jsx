import React, {useState, useEffect} from "react";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

import axios from "axios";
import api from "api/APIHandler";



const ModalCreateWorkshop = ({closeModal, setModalWorkshopInfos}) => {

    const [values, setValues] =  useState({"workshop_name":"MC","admin_name":"PB","participants_nb":22,"admin_email":"pascal@mail.com"})
    //useState({
    //     "workshop_name": '',
    //     "admin_name": '',
    //     "participants_nb": '',
    //     "admin_email": ''
    //   });

    useEffect(() => {

        //DIRECT FROM NAVIGATOR
        axios.post("https://aggregator-api.mission-climat.io/workshop/",
            { 
                headers: 
                    {
                        "Authorization": `Token d42627a8314d1e157d7fa517730e94b43db137b2`,
                        'Content-Type': 'application/json'
                    },
                body : {...values}
            })
        .then(res=>console.log(res))
        .catch(err=> {
            console.log(err.response);
        })

        //FROM OUR BACK
        api
        .post("/aggregator/workshop/",{body : {...values}})
        .then((res) => {console.log( res);})
        .catch((err) => console.log(err));

      }, []);

    const handleSubmit = e => {
        e.preventDefault();
        
        //INSERT CORRECT REQUEST HERE
        
        closeModal()
        setModalWorkshopInfos(true)
    }

    const handleChange = e => {
        setValues({...values, [e.target.id]: e.target.value})
    }

    return (
        <div>
            <form className="form" onSubmit={e=>handleSubmit(e)}>
                <FormControl>
                    <InputLabel htmlFor="workshop_name">Nom Atelier</InputLabel>
                    <Input id="workshop_name" onChange={e=>handleChange(e)} required/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="admin_name">Responsable / Animateur de l'atelier</InputLabel>
                    <Input id="admin_name" onChange={e=>handleChange(e)}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="participants_nb">Nombre de participants</InputLabel>
                    <Input id="participants_nb" onChange={e=>handleChange(e)}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="admin_email">Email</InputLabel>
                    <Input id="admin_email" type="email" required onChange={e=>handleChange(e)}/>
                    <FormHelperText>We'll never share your email.</FormHelperText>
                </FormControl>
                <Button onClick={()=>closeModal()}>Annuler</Button>
                <Button type="submit">Ok</Button>
            </form>
        </div>
    )
}

export default ModalCreateWorkshop
