<template>
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Covid Tracker</a>
        </div>
   </nav>
   

    <div class="mt-2">
        <div class="row">
            <div class="col-md-2">
               <h3>{{this.input}}</h3>
            </div>
            <div class="col-md-10">
                <input type="date" id="menus"  v-model="dateInput"   @change="onChange()">
                <select id="menus"  @change="onSort($event)">
                <option :value="0">sort</option>
                <option :value="1">Confirmed Count: Low to High </option>
                <option :value="2">Confirmed Count: High to Low </option>
               
                </select>

                <select id="select"  @change="onRoleChange($event)" >
                        <option>Districts</option>
                        <option v-for="(district,keys) in firstData.districts" v-bind:key="keys" :value="keys">{{keys}}</option>
                </select>
            </div>
        </div>
        
         
        
  </div>

  <hr>


    <table class="table table-bordered">
    <thead>
      <tr>
        <th>Date</th>
        <th>Confirmed</th>
        <th>Recovered</th>
        <th>Deceased</th>
        <th>Delta</th>
        <th>Delta7</th>
      </tr>
    </thead>
    <tbody>
        <tr v-if="detail===undefined">
         No data available!
        </tr>
      <tr  v-for="(data,keys) in detail" v-bind:key="keys" :value="keys">
        <td>{{onDateFilter===false ? keys :dateInput}}</td>
        <td>{{ data===undefined ||data.total===undefined||data.total.confirmed===undefined ? 'Not Available': data.total.confirmed}}</td>
        <td>{{ data===undefined ||data.total===undefined||data.total.recovered===undefined ? 'Not Available': data.total.recovered}}</td>
        <td>{{ data===undefined ||data.total===undefined||data.total.deceased===undefined ? 'Not Available':  data.total.deceased}}</td>
        <td>
           <tr>Confirmed:{{ data===undefined || data.delta===undefined || data.delta.confirmed===undefined? 'Not Available': data.delta.confirmed}}</tr> 
           <tr>Recovered:{{ data===undefined || data.delta===undefined || data.delta.recoverede===undefined? 'Not Available': data.delta.recovered}}</tr>
           <tr> Deceased:{{ data===undefined || data.delta===undefined || data.delta.deceased===undefined? 'Not Available': data.delta.deceased}}</tr>
        </td>
        <td>
           <tr>Confirmed:{{ data===undefined || data.delta7===undefined || data.delta7.confirmed===undefined? 'Not Available': data.delta7.confirmed}}</tr> 
           <tr>Recovered:{{ data===undefined || data.delta7===undefined || data.delta7.recoverede===undefined? 'Not Available': data.delta7.recovered}}</tr>
           <tr> Deceased:{{ data===undefined || data.delta7===undefined || data.delta7.deceased===undefined? 'Not Available': data.delta7.deceased}}</tr>
        </td>
      </tr>
    </tbody>
  </table>

</template>









<script>
import router from '../router';
import axios from 'axios';

export default {
  name: 'detailPage',
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
      stateDetail:{},
      detail:{},
      dateInput:"",
      input:'',
      onDateFilter:false,
      ascendingValue:{}
    }
  },
  methods:{
    getData(){
        this.firstData=this.covidData[`${this.input}`];

         axios.get(`https://data.covid19india.org/v4/min/timeseries.min.json`).then(response=>{
           // localStorage.setItem('datedData',JSON.stringify(response.data))
            this.detail=response.data[`${this.input}`].dates;
            this.stateDetail=this.detail;
         })
    },
    onChange(){
         this.detail=this.stateDetail;
        if(this.dateInput===undefined||this.dateInput==''){
            this.onDateFilter=false;
            this.detail=this.stateDetail;
        }else{
            this.onDateFilter=true;
            this.detail={'dates':this.detail[`${this.dateInput}`]};
        }
      
        
    },

    onRoleChange(event){
        this.dateInput='N/A'
        this.detail=this.stateDetail;
        if(event.target.value=='Districts'){
             this.onDateFilter=false;
        }else{
          this.onDateFilter=true;
        
        this.detail={'dates':this.firstData.districts[event.target.value]}
        }
        
      
    },
    onSort(event){
        
          if(event.target.value==1){
                if(JSON.stringify(localStorage.getItem('ascendingData'))){
                    this.detail=JSON.stringify(localStorage.getItem('ascendingData'));
                }else{
                       let y={};
               Object.entries(this.detail).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.confirmed;


             
                  let sortable = [];
                  for (var sortValue in y) {
                      sortable.push([sortValue, y[sortValue]]);
                  }

                  sortable.sort(function(a, b) {
                      return a[1] - b[1];
                  });
                   let s={};     
                   this.detail=this.stateDetail;          
                sortable.reduce((obj,key)=>{
                  s[`${key[0]}`]=this.detail[`${key[0]}`];
                  return s;
                 })
                 

                 this.detail=s;            
                 this.ascendingValue=s;
                 localStorage.setItem('ascendingData',JSON.stringify(s));
                // JSON.parse(localStorage.getItem('covidData'));
               }); 
              
                }
                //}
             
        }else if(event.target.value==2){
                if(JSON.stringify(localStorage.getItem('descendingData'))){
                    this.detail=JSON.stringify(localStorage.getItem('descendingData'));
                }else{

                       let y={};
               Object.entries(this.detail).forEach(([key,value])=>{
                 // y.push({key:value.total.confirmed})
                 y[key]=value.total.confirmed;


             
                  let sortable = [];
                  for (var sortValue in y) {
                      sortable.push([sortValue, y[sortValue]]);
                  }

                  sortable.reverse(function(a, b) {
                      return b[1] - a[1];
                  });
                   let s={};     
                   this.detail=this.stateDetail;          
                sortable.reduce((obj,key)=>{
                  console.log(obj)
                  s[`${key[0]}`]=this.detail[`${key[0]}`];
                  return s;
                 })
                 

                 this.detail=s;            
                 this.ascendingValue=s;
                 localStorage.setItem('descendingData',JSON.stringify(s));
                 //JSON.parse(localStorage.getItem('covidData'));
               }); 
            
                }  
        }
    }
  },

  mounted(){
      this.input = this.router.currentRoute._value.params.request;
      
   
    this.covidData=JSON.parse(localStorage.getItem('covidData'));
      this.getData();
  }
  }
</script>
<style scoped>

#menus{
  margin-right: 20px;
}

</style>

