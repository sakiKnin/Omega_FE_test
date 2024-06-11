import './App.css';
import { useState, useEffect } from 'react';
import moment from 'moment';

function App() {
  const [ugovorArr, setUgovorArr] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [searchUgovorArr, setSearchUgovorArr] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);
  const [tempUgovor, setTempUgovor] = useState({});
  const [tempRokIsporuke, setTempRokIsporuke] = useState("");
  const [tempStatus, setTempStatus] = useState("");
   
  const kreirajUgovor = () => {
    setIsNew(true);
  }

  const kreirajNoviUgovor = (event) => {
    console.log("kreiraj novi ugovor");
    event.preventDefault();
    console.log(event.target.kupac.value);
    let noviUgovor = {id: ugovorArr.length + 1,
      kupac: event.target.kupac.value,
      broj_ugovora: event.target.broj_ugovora.value,
      datum_akontacije: moment(event.target.datum_akontacije.value).format("YYYY-MM-DD"),
      rok_isporuke: moment(event.target.rok_isporuke.value).format("YYYY-MM-DD"),
      status:"KREIRANO"};

    setUgovorArr([...ugovorArr,noviUgovor]);
    setIsNew(false);
 }

 const prikaziDetalje = (item) => {
    console.log("Prikazi detalje");
    setTempRokIsporuke(item.rok_isporuke);
    setTempStatus(item.status);
    setIsDetail(true);
    setTempUgovor(item);
 }

 const closeDialog = () => {
    setTempUgovor({});
    setIsDetail(false);
 }

  const spremiIzmjene = (id) => {
    console.log("Spremi izmjene - ugovor id: " + id);
    let tmpUgovorArr = ugovorArr;
    let tmp=tmpUgovorArr.filter(item=>item.id===id);
    let index = tmpUgovorArr.indexOf(tmp[0]); 
    tmpUgovorArr[index].rok_isporuke=tempRokIsporuke;
    tmpUgovorArr[index].status=tempStatus;
    setUgovorArr(tmpUgovorArr);
    setTempUgovor({});
    setTempRokIsporuke("");
    setIsDetail(false);
  }

  useEffect(()=>{
    if(tempUgovor.rok_isporuke!==tempRokIsporuke || tempUgovor.status!==tempStatus){
      setIsSaveBtnDisabled(false);
    }else{
      setIsSaveBtnDisabled(true);
    }
  },[tempRokIsporuke, tempStatus]);

  useEffect(()=>{
    if(searchItem!==""){
      setSearchUgovorArr(ugovorArr.filter((item)=>item.kupac.toUpperCase().includes(searchItem.toUpperCase())||item.status.toUpperCase().includes(searchItem.toUpperCase())));
    }
  },[searchItem]);
 

  useEffect(() => {
    console.log("Dohvati podatke - API");
    const getData = async () => {
      const response = await (await fetch("http://localhost:3000//test_ugovor.json",{
        headers:{
          accept: 'application/json',
          'User-agent': 'Omega Test App',
        }
      })).json();
       
      setUgovorArr(response);
    }
    getData(); 
  },[])

 
  return (
    <div className="App" >
      <div style={{zIndex:!isNew?-1:1}} className="modal-wrapper"/>
      <div style={{zIndex:!isDetail?-1:1}} className="modal-wrapper"/>
      {isDetail?<div className="detail-wrapper">
            <ul className="detail">
              <li>Kupac:{' '}<u>{tempUgovor.kupac}</u></li>
              <li>Broj ugovora:{' '}<u>{tempUgovor.broj_ugovora}</u></li>
              <li>Datum akontacije:{' '}<u type="date">{tempUgovor.datum_akontacije}</u></li>
              <li>Rok isporuke:{' '}{tempUgovor.status!=="ISPORUČENO"?<input type="date" className="input-detail" value={tempRokIsporuke} onChange={(e) => setTempRokIsporuke(e.target.value)}/>:<u>{tempRokIsporuke}</u>}</li>
              <li>Status:{' '}{tempUgovor.status!=="ISPORUČENO"?<div className="input-detail">{tempUgovor.status==="KREIRANO"?<select onChange={(e) => setTempStatus(e.target.value)}><option value={tempUgovor.status}>{tempUgovor.status}</option><option value="NARUČENO">NARUČENO</option></select>:null}{tempUgovor.status==="NARUČENO"?<select onChange={(e) => setTempStatus(e.target.value)}><option value={tempUgovor.status}>{tempUgovor.status}</option><option value="ISPORUČENO">ISPORUČENO</option></select>:null}</div>:<u>{tempUgovor.status}</u>}</li>
              <li>
              <button className="close-modal-btn" onClick={() => closeDialog()}>Zatvori</button>
              <input type="button" value="Spremi "className="save-modal-btn" onClick={() => spremiIzmjene(tempUgovor.id)} disabled={isSaveBtnDisabled?true:false} style={{background:isSaveBtnDisabled?"#ccc":"greenyellow", cursor:isSaveBtnDisabled?"auto":"pointer"}}/>
              </li>
            </ul>
          </div>
        :null}
      {isNew?<div className="form-wrapper">
            <form onSubmit={(e) => kreirajNoviUgovor(e)}>
            <label>Kupac:</label>
            <input type="text" id="kupac" name="kupac" required/>
            <label>Broj ugovora:</label>
            <input type="text" id="broj_ugovora" name="broj_ugovora" required/>
            <label>Datum akontacije:</label>
            <input type="date" id="datum_akontacije" name="datum_akontacije" required/>
            <label>Rok isporuke:</label>
            <input type="date" id="rok_isporuke" name="rok_isporuke" required/>
            <div className="create-btn-wrapper">
              <input type="button" className="close-modal-btn" value="Zatvori" onClick={() => setIsNew(false)}/>
              <input type="submit" className="submit-btn" value="Kreiraj"/>
            </div>
            </form>
          </div>
        :null}
      <div className="main-wrapper">
      <header className="App-header">
          OMEGA TEST APP
      </header>
      <div className="App-body">
        <div className="filter-wrapper">
          <div>Filter:</div><input className="filter-input" value={searchItem} onChange={(e) => setSearchItem(e.target.value)}/>
        </div>
        <table>
          <thead>
          <tr>
            <th>Ime kupca</th>
            <th>Broj ugovora</th>
            <th>Rok isporuke</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          {searchItem===""?ugovorArr.map((item) => {
            return <tr key={item.id} style={{cursor:!isNew?'pointer':null}} onClick={() => prikaziDetalje(item)}>
              <td>{item.kupac}</td>
              <td>{item.broj_ugovora}</td>
              <td>{moment(item.rok_isporuke).format("YYYY-MM-DD")}</td>
              <td style={{color:item.status==='KREIRANO'?'green':(item.status==='NARUČENO'?'gold':'#ccc')}}>{item.status}</td>
            </tr>
          }):
          searchUgovorArr.map((item) => {
            return <tr key={item.id} style={{cursor:!isNew?'pointer':null}} onClick={() => prikaziDetalje(item)}>
              <td>{item.kupac}</td>
              <td>{item.broj_ugovora}</td>
              <td>{moment(item.rok_isporuke).format("YYYY-MM-DD")}</td>
              <td style={{color:item.status==='KREIRANO'?'green':(item.status==='NARUČENO'?'gold':'#ccc')}}>{item.status}</td>
            </tr>
          })
          }
          </tbody>
        </table>
        {!isNew?
        <div className="btn-wrapper">
          <button onClick={() => kreirajUgovor()}>Novi ugovor</button>
        </div>
        :null}
      </div>
      </div>
    </div>
  );
}

export default App;