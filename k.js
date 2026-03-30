const api='https://www.omdbapi.com/?i=tt3896198&apikey=790c1965';

const fetchData=async()=>{
    let data=await fetch(api);
    data=await data.json();
    console.log(data);
}


fetchData();


