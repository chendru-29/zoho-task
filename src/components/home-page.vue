<template>

 <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Covid Tracker</a>
  </div>
</nav>

  <div class="d-flex mt-2">
         <h3>Search</h3>
         <div class="d-flex" style="margin-left:400px">
         <div  id="menus">
            <input class="input" placeholder="search for state" id="searchValue" style="height:45px">
            <font-awesome-icon class="mt-3" style="position:absolute;right:46%;" icon="search" v-on:click="onSearch()" /> 
         </div>
         <input type="date" id="menus"  v-model="dateInput"  @change="onChange()">
         <select id="menus"  @change="onSort($event)">
          <option :value="0">sort</option>
          <option :value="1">Confirmed Count: Low to High </option>
          <option :value="2">Confirmed Count: High to Low </option>
          <option :value="3">Vaccinated 1 Percentage: Low to High </option>
          <option :value="4">Vaccinated 1 Percentage: High to Low </option>
          <option :value="5">Vaccinated 2 Percentage: Low to High </option>
          <option :value="6">Vaccinated 2 Percentage: High to Low </option>
         </select>
         </div>
         
  </div>

<hr>

 <div class="row justify-content-center d-flex mt-2" style="width:100%">
 <!--  <div class="col-md-12"> -->
      <div v-for="(data, key, index) in covidData" v-bind:key="data"  class="card p-3" v-on:click="onClickState(key)">
         <!--  {{ data.total.confirmed}} -->
          <div class="row">
            <div class="col-md-6">
              <h3 class="pull-left d-flex">{{key!=''? key: value}}</h3>
            </div>
            <div class="col-md-6">
              <select id="select"   @change="onRoleChange($event,index,key)"  @click.stop.prevent>
                <option>Districts</option>
                <option v-for="(district,keys) in data.districts" v-bind:key="keys" :value="keys">{{keys}}</option>
              </select>
            </div>
          </div>

          <div class="justify-content-center">
            <div v-if="data.currentIndex==undefined">
               <h4>Total</h4>
            <p>Confirmed: {{ data.total.confirmed ===undefined?'N/A':data.total.confirmed}}</p>
            <p>Recovered: {{ data.total.recovered ===undefined?'N/A':data.total.recovered}}</p>
            <p>Deceased : {{ data.total.deceased===undefined?'N/A':data.total.deceased}}</p>
            <p>Vaccination dose1 : {{ data.total.vaccinated1===undefined?'N/A':data.total.vaccinated1}}</p>
            <p>Vaccination dose2 : {{ data.total.vaccinated2===undefined?'N/A':data.total.vaccinated2}}</p>
            </div>

            <div v-if="data.currentIndex==1">
               <h4>Delta</h4>
            <p>Confirmed: {{data.delta.confirmed===undefined?'N/A':data.delta.confirmed }}</p>
            <p>Recovered: {{ data.delta.recovered ===undefined?'N/A': data.delta.recovered}}</p>
            <p>Deceased : {{ data.delta.deceased ===undefined?'N/A':data.delta.deceased}}</p>
            <p>Vaccination dose1 : {{ data.delta.vaccinated1 ===undefined?'N/A':data.delta.vaccinated1}}</p>
            <p>Vaccination dose2 : {{ data.delta.vaccinated2 ===undefined?'N/A':data.delta.vaccinated2}}</p>
            </div>

            <div v-if="data.currentIndex==2">
               <h4>Delta7</h4>
            <p>Confirmed: {{data.delta7.confirmed===undefined?'N/A':data.delta7.confirmed }}</p>
            <p>Recovered: {{ data.delta7.recovered ===undefined?'N/A': data.delta7.recovered}}</p>
            <p>Deceased : {{ data.delta7.deceased ===undefined?'N/A':data.delta7.deceased}}</p>
            <p>Vaccination dose1 : {{ data.delta7.vaccinated1 ===undefined?'N/A':data.delta7.vaccinated1}}</p>
            <p>Vaccination dose2 : {{ data.delta7.vaccinated2 ===undefined?'N/A':data.delta7.vaccinated2}}</p>
            </div>
           
                <font-awesome-icon @click.stop.prevent  style="left:85%;bottom: 140px; position: absolute;"  icon="angle-right" v-if="data.currentIndex<2 || data.currentIndex==undefined" v-on:click="onNext(key)" />
                <font-awesome-icon  @click.stop.prevent  style="right:85%;bottom: 140px; position: absolute;"  icon="angle-left" v-if="data.currentIndex!=undefined" v-on:click="onPrev(key)"  />
          </div>
      </div>
 <!--  </div> -->
 </div>

 
</template>

<script>

import axios from 'axios';
import router from '../router';

export default {
  name: 'Home_Page',
  props: {
    msg: String
  },
  setup(){
  return{
        router
      }
    },  
  data(){
    return{
      covidData:{},
      firstData:{},
      dateInput:"",
      value:''
    }
  },

  methods:{

    getCovidDetails(){
            axios.get(`https://data.covid19india.org/v4/min/data.min.json`).then(response=>{
            
            
             this.covidData=response.data;
             this.firstData=response.data;
            localStorage.setItem('covidData',JSON.stringify(response.data))
              
            })
    },
    onRoleChange(event,index,key){
     
                 this.covidData[`${key}`].total=this.covidData[`${key}`].districts[`${event.target.value}`].total;
                
    },

    
    onSearch(){
       this.covidData=this.firstData;
       this.value= document.getElementById("searchValue").value;
       this.value=this.value.toUpperCase();
      

    Object.entries(this.covidData).filter((data)=>{
              
            if(data[0]==this.value.toUpperCase()){
              this.covidData=[data[1]];
            }
          })
     },
     onChange(){
        axios.get(`https://data.covid19india.org/v4/min/timeseries.min.json`).then(response=>{
               Object.freeze(response.data)
              localStorage.setItem('datedData',JSON.stringify(response.data))
              this.covidData=response.data;
              
               let k={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                
                 Object.entries(value).forEach(([x,y])=>{
                     console.log(x);
                  Object.entries(y).forEach(([a,b])=>{
                    
                     if(a==`${this.dateInput}`){
                        
                        k[key]=b;
                        
                   }
                    
                  })
                   
                 })
                   
               });
              // Object.freeze(k)
              this.covidData=k;

              
           
        })
      
     },
     onSort(i){
        if(i.target.value==2){
       
                let y={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.confirmed;

                
             
                  let sortable = [];
                  for (var vehicle in y) {
                      sortable.push([vehicle, y[vehicle]]);
                  }

                  sortable.reverse(function(a, b) {
                      return b[1] - a[1];
                  });
                   let s={};               
                 sortable.reduce((obj,key)=>{
                  console.log(obj)
                  s[`${key[0]}`]=this.covidData[`${key[0]}`];
                  return s;
                 })
                 this.firstData=s;
               
                   
               }); 
               this.covidData=this.firstData;
        

        }else if(i.target.value==1){
                
                let y={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.confirmed;
             
                  let sortable = [];
                  for (var vehicle in y) {
                      sortable.push([vehicle, y[vehicle]]);
                  }

                  sortable.sort(function(a, b) {
                      return a[1] - b[1];
                  });
                   let s={};               
                sortable.reduce((obj,key)=>{
                    console.log(obj)
                  s[`${key[0]}`]=this.covidData[`${key[0]}`];
                  return s;
                 })
               
                 this.firstData=s;
                
               
                   
               }); 
               this.covidData=this.firstData;
        
       
         
        }else if(i.target.value==3){
          //window.alert('hi')
            let y={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.vaccinated1;

             
                  let sortable = [];
                  for (var vehicle in y) {
                      sortable.push([vehicle, y[vehicle]]);
                  }

                  sortable.sort(function(a, b) {
                      return a[1] - b[1];
                  });
                   let s={};               
                sortable.reduce((obj,key)=>{
                  console.log(obj)
                  s[`${key[0]}`]=this.covidData[`${key[0]}`];
                  return s;
                 })
                 this.firstData=s;
                
               
                   
               }); 
               this.covidData=this.firstData;
        }else if(i.target.value==4){
          //window.alert('hi')
            let y={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.vaccinated1;


             
                  let sortable = [];
                  for (var vehicle in y) {
                      sortable.push([vehicle, y[vehicle]]);
                  }

                  sortable.sort(function(a, b) {
                      return b[1] - a[1];
                  });
                   let s={};               
                sortable.reduce((obj,key)=>{
                  s[`${key[0]}`]=this.covidData[`${key[0]}`];
                  return s;
                 })
                 this.firstData=s;
                
               
                   
               }); 
               this.covidData=this.firstData;
        }else if(i.target.value==5){
          //window.alert('hi')
            let y={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                 y[key]=value.total.vaccinated2;

                 console.log(y);

             
                  let sortable = [];
                  for (var vehicle in y) {
                      sortable.push([vehicle, y[vehicle]]);
                  }

                  sortable.sort(function(a, b) {
                      return a[1] - b[1];
                  });
                   let s={};               
                sortable.reduce((obj,key)=>{
                  console.log(obj)
                  s[`${key[0]}`]=this.covidData[`${key[0]}`];
                  return s;
                 })
                 this.firstData=s;
                
               
                   
               }); 
               this.covidData=this.firstData;
        }else if(i.target.value==6){
          //window.alert('hi')
            let y={};
               Object.entries(this.covidData).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.vaccinated2;

             
                  let sortable = [];
                  for (var vehicle in y) {
                      sortable.push([vehicle, y[vehicle]]);
                  }

                  sortable.sort(function(a, b) {
                      return b[1] - a[1];
                  });
                   let s={};               
                sortable.reduce((obj,key)=>{
                  s[`${key[0]}`]=this.covidData[`${key[0]}`];
                  return s;
                 })
                 this.firstData=s;
                
               
                   
               }); 
               this.covidData=this.firstData;
        }else if(i.target.value==0){
              this.getCovidDetails();
        }
       
        
     },
     onClickState(name){
      this.router.push(`/state/${name}`)
     },
     onNext(index){
         if(this.covidData[index].currentIndex===undefined){
          this.covidData[index]['currentIndex']=1;
         }else if(this.covidData[index].currentIndex==1){
          this.covidData[index]['currentIndex']=2;
          
         }
         
     },
     onPrev(index){
         if(this.covidData[index].currentIndex===2){
          this.covidData[index]['currentIndex']=1;
         }else if(this.covidData[index].currentIndex==1){
          this.covidData[index]['currentIndex']=undefined;
           
         }
     }
   
  },
   mounted(){
        this.getCovidDetails();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card{
width:30%;margin-right: 10px;
}

#menus{
  margin-right: 20px;
  height: 45px;
}

#select{
  width: 150px;
}
</style>
