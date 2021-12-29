import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";
import "./new.css";
import {AuthContext} from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import {toast} from "react-toastify";

export default function New() {

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);


  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [complemento, setComplemento] = useState("");
  const {user} = useContext(AuthContext);

  useEffect(()=>{
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        let lista = [];
        snapshot.forEach((doc)=>{
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })
        if(lista.length ===0){
          toast.error('Nenhuma empresa encontrada');
          setCustomers([{id:1,nomeFantasia: 'FREELA'}]);
          setLoadCustomers(false);
          return;
        }
        setCustomers(lista);
        setLoadCustomers(false);
      })
      .catch((error)=>{
        toast.error('Ops! Ocorreu um erro.',error)
        setLoadCustomers(false);
        setCustomers([{id:1,nomeFantasia: ''}]);        
      })
    }
    loadCustomers();
  },[]);


  function handleRegister(e) {
    e.preventDefault();    
  }
  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }
  function handleOptionChange(e){
      setStatus(e.target.value);    
  }
  //Chamado quando troca de cliente
  function handleChangeCustomers(e){
   setCustomerSelected(e.target.value);
  }


  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo Chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando Cliente"/>
            ):(
              <select value={customerSelected} onChange={handleChangeCustomers}>
             {customers.map((item,index)=>{
               return(
                 <option key={item.id} value={index}>
                   {item.nomeFantasia}
                 </option>
               )
             })}
            </select>
            )}
            

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'} />
              <span>Em aberto</span>

              <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'} />
              <span>Progresso</span>

              <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'} />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)"
              value={complemento}
              onChange={(e)=> setComplemento(e.target.value)}
            />

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
