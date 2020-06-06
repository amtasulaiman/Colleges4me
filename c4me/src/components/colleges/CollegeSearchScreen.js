import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import RangeInput from './RangeInput.js';
import SelectorInput from './SelectorInput.js';
import Collapsible from 'react-collapsible';
import { firestoreConnect } from 'react-redux-firebase';
import SelectorInputMajor from './SelectorInputMajor.js';
import { Modal, Button, Row, Col, Card } from 'react-materialize';

import firebase, { db } from "../../firebase";

class CollegeSearchScreen extends React.Component {
  constructor(props){
    super(props);
    this.filters={};
    this.currentItemSortCriteria = null;
    this.newItemSortCriteria = null;
    this.flipped = false;
  }

  state={
    locations: ["Northeast","Midwest","South","West", 
    "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA",
    "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", 
    "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"],
    majors: ["Accounting","Architecture","Art","Biochemistry","Biology","Chemistry","Computer Science","Economics","Engineering","English","Environmental Studies","Graphic Design","History","Law","Linguistics","Mathematics","Music","Nursing","Philosophy","Physics","Political Science","Pre Med","Psychology","Religion","Teaching"],
    northeast: ["NY", "ME", "NH", "VT", "MA", "RI", "CT", "NJ", "PA"],
    midwest: ["ND", "SD", "NE", "KS", "MN", "IA", "MO", "WI" , "IL", "MI", "IN", "OH"],
    south: ["OK", "TX", "AR", "LA", "KY", "TN", "MS", "AL" , "DE", "MD", "WV", "VA", "NC", "SC", "GA", "FL"],
    west: ["WA", "OR", "CA", "ID", "NV", "MT", "WY", "UT" , "AZ", "CO", "NM", "HI", "AK"],
    colleges: {},
    admissionRateMin: null,
    region: null,
    filterName: '',
    admissionRateMax: null,
    costOfAttendanceMin: null,
    costOfAttendanceMax: null,
    sizeMin: null,
    sizeMax: null,
    major1: null,
    major2: null,
    location: null,
    rankingMin: null,
    rankingMax: null,
    sATMathMin: null,
    sATMathMax: null,
    sATEBRWMin: null,
    sATEBRWMax: null,
    aCTCompositeMin: null,
    aCTCompositeMax: null,
    filterType: "strict"
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    console.log(this.state);
    /*
    this.setState({colleges:{
      college1: "Hello",
      college2: "Hello",
      college3: "Hello",
      college4: "Hello"
    }});
    */
   var collegeDict = {};
   let collegesRef = db.collection('ScrapedCollegeData');
   //all null
   if(this.state.admissionRateMin == null && this.state.filterName == '' && this.state.admissionRateMax == null && 
    this.state.costOfAttendanceMax == null && this.state.costOfAttendanceMin == null && this.state.sizeMin == null && 
    this.state.sizeMax == null && this.state.major1 == null && this.state.major2 == null && 
    this.state.location == null && this.state.rankingMin == null && this.state.rankingMax == null && 
    this.state.sATMathMin == null && this.state.sATMathMax == null && this.state.sATEBRWMin == null && 
    this.state.sATEBRWMax == null && this.state.aCTCompositeMin == null && this.state.aCTCompositeMax == null ){
      const allColleges = collegesRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          collegeDict[doc.data().name] = {
            AdmissionRate: doc.data().admission_rate,
            AvgACTComposite: doc.data().AvgACTComposite,
            AvgGPA: parseInt(doc.data().avg_gpa),
            AvgACTENG:(parseInt(doc.data().act_ENG75)+parseInt(doc.data().act_ENG25))/2 ,
            AvgACTMATH: (parseInt(doc.data().act_Math75)+parseInt(doc.data().act_Math25))/2 ,
            AvgSATEBRW: parseInt(doc.data().sat_ReadMid),
            AvgSATMath: (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2,
            CostOfAttendance: doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null,
            Location: doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null,
            Major1: doc.data().Major1,
            Major2: doc.data().Major2,
            Major3: doc.data().Major3,
            Name: doc.data().name,
            Ranking: doc.data().rank,
            Size: doc.data().num_ugrads,
            Recommendation: 0,
            SimilarProfiles: {}
          };
        });
      })
      .then(() => {
        console.log("Empty Filter Search");
        this.setState({colleges:collegeDict});
        console.log(this.state);
        this.sortTasks("name");
        alert("Finished Searching");
      });
     return;
   }
   //strict search
   if(this.state.filterType == "strict"){
    const allColleges = collegesRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let tempAddition = {
            AdmissionRate: doc.data().admission_rate,
            AvgACTComposite: doc.data().AvgACTComposite,
            AvgSATEBRW: parseInt(doc.data().sat_ReadMid),
            AvgGPA: parseInt(doc.data().avg_gpa),     
            AvgACTENG:(parseInt(doc.data().act_ENG75)+parseInt(doc.data().act_ENG25))/2 ,
            AvgACTMATH: (parseInt(doc.data().act_Math75)+parseInt(doc.data().act_Math25))/2 ,
            AvgSATMath: (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2,
            CostOfAttendance: doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null,
            Location: doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null,
            Major1: doc.data().Major1,
            Major2: doc.data().Major2,
            Major3: doc.data().Major3,
            Name: doc.data().name,
            Ranking: doc.data().rank,
            Size: doc.data().num_ugrads,
            Recommendation: 0,
            SimilarProfiles: {}
          };
          console.log(tempAddition);
          console.log(this.state);
          //null checking
          if(this.state.admissionRateMax == null || this.state.admissionRateMax == ""){
            this.setState({admissionRateMax:101});
          }
          if(this.state.admissionRateMin == null || this.state.admissionRateMin == ""){
            this.setState({admissionRateMin:-1});
          }
          
          if(this.state.costOfAttendanceMax == null || this.state.costOfAttendanceMax == ""){
            this.setState({costOfAttendanceMax:999999});
          }
          if(this.state.costOfAttendanceMin == null || this.state.costOfAttendanceMin == ""){
            this.setState({costOfAttendanceMin: -1});
          }

          if(this.state.sizeMax == null || this.state.sizeMax == ""){
            this.setState({sizeMax: 999999});
          }
          if(this.state.sizeMin == null || this.state.sizeMin == ""){
            this.setState({sizeMin:-1});
          }

          if(this.state.rankingMax == null || this.state.rankingMax == ""){
            this.setState({rankingMax:999999});
          }
          if(this.state.rankingMin == null || this.state.rankingMin == ""){
            this.setState({rankingMin:-1});
          }

          if(this.state.sATMathMax == null || this.state.sATMathMax == ""){
            this.setState({sATMathMax:801});
          }
          if(this.state.sATMathMin == null || this.state.sATMathMin == ""){
            this.setState({sATMathMin:-1});
          }

          if(this.state.sATEBRWMax == null || this.state.sATEBRWMax == ""){
            this.setState({sATEBRWMax:801});
          }
          if(this.state.sATEBRWMin == null || this.state.sATEBRWMin == ""){
            this.setState({sATEBRWMin:-1});
          }

          if(this.state.aCTCompositeMax == null || this.state.aCTCompositeMax == ""){
            this.setState({aCTCompositeMax:41});
          }
          if(this.state.aCTCompositeMin == null || this.state.aCTCompositeMin == ""){
            this.setState({aCTCompositeMin:-1});
          }
          //
          if((this.state.admissionRateMax >= doc.data().admission_rate*100 && doc.data().admission_rate != null || this.state.admissionRateMax == 101) && 
          (this.state.admissionRateMin <= doc.data().admission_rate*100 && doc.data().admission_rate != null || this.state.admissionRateMin == -1) && 
          (this.state.costOfAttendanceMax >= (doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null) && doc.data().tuition_fees != null || this.state.costOfAttendanceMax == 999999) && 
          (this.state.costOfAttendanceMin <= (doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null) && doc.data().tuition_fees != null || this.state.costOfAttendanceMin == -1)&& 
          (this.state.sizeMax >= (doc.data().num_ugrads ? parseInt(((doc.data().num_ugrads).replace(/,/g, '')).replace(/\$/g, '')) : null) && doc.data().num_ugrads != null || this.state.sizeMax == 999999)&& 
          (this.state.sizeMin <= (doc.data().num_ugrads ? parseInt(((doc.data().num_ugrads).replace(/,/g, '')).replace(/\$/g, '')) : null) && doc.data().num_ugrads != null || this.state.sizeMin == -1)&& 
          (this.state.rankingMax >= doc.data().rank && doc.data().rank != null || this.state.rankingMax == 999999)&& 
          (this.state.rankingMin <= doc.data().rank && doc.data().rank != null || this.state.rankingMin == -1)&& 
          (this.state.sATMathMax >= (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2 && (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2 != null || this.state.sATMathMax == 801)&& 
          (this.state.sATMathMin <= (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2 && (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2 != null || this.state.sATMathMin == -1)&& 
          (this.state.sATEBRWMax >= parseInt(doc.data().sat_ReadMid) && parseInt(doc.data().sat_ReadMid) != null || this.state.sATEBRWMax == 801)&& 
          (this.state.sATEBRWMin <= parseInt(doc.data().sat_ReadMid) && parseInt(doc.data().sat_ReadMid) != null || this.state.sATEBRWMin == -1)&& 
          (this.state.aCTCompositeMax >= doc.data().AvgACTComposite && doc.data().AvgACTComposite != null || this.state.aCTCompositeMax == 41)&& 
          (this.state.aCTCompositeMin <= doc.data().AvgACTComposite && doc.data().AvgACTComposite != null || this.state.aCTCompositeMin == -1) 
          ){
            //check for: filterName, major1/2, location
            if(this.state.filterName == "" && this.state.major1 == null && this.state.major2 == null && this.state.location == null){
              console.log("matched");
              collegeDict[doc.data().name] = tempAddition;
            }
            //if name !empty
            if(this.state.filterName != "" && (this.state.filterName.toLowerCase() == doc.data().name.toLowerCase() 
            || doc.data().name.toLowerCase().includes(this.state.filterName.toLowerCase()))){
              if(this.state.major1 == null && this.state.major2 == null && this.state.location == null){
                collegeDict[doc.data().name] = tempAddition;
              }
              if(this.state.major1 == null && this.state.major2 == null && this.state.location != null){
                if(this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false)){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 == null && this.state.major2 != null && this.state.location == null){
                if(this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 == null && this.state.major2 != null && this.state.location != null){
                if((this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
                && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 == null && this.state.location == null){
                if(this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 == null && this.state.location != null){
                if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
                && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 != null && this.state.location == null){
                if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
                && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 != null && this.state.location != null){
                if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
                && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
                && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) 
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
            }
            //
            if(this.state.filterName == "" ){
              if(this.state.major1 == null && this.state.major2 == null && this.state.location == null){
                collegeDict[doc.data().name] = tempAddition;
              }
              if(this.state.major1 == null && this.state.major2 == null && this.state.location != null){
                if(this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == "" 
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false)){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 == null && this.state.major2 != null && this.state.location == null){
                if(this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 == null && this.state.major2 != null && this.state.location != null){
                if((this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
                && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 == null && this.state.location == null){
                if(this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 == null && this.state.location != null){
                if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
                && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 != null && this.state.location == null){
                if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
                && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
              if(this.state.major1 != null && this.state.major2 != null && this.state.location != null){
                if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
                && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
                && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
                || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                  collegeDict[doc.data().name] = tempAddition;
                }
              }
            }
          }
        });
      })
      .then(() => {
        this.setState({colleges:collegeDict});
        this.sortTasks("name");
        alert("Finished Searching");
        //reset to nulls
        if(this.state.admissionRateMax == 101){
          this.setState({admissionRateMax : null});
        }
        if(this.state.admissionRateMin == -1){
          this.setState({admissionRateMin : null});
        }
        if(this.state.costOfAttendanceMax == 999999){
          this.setState({costOfAttendanceMax: null});
        }
        if(this.state.costOfAttendanceMin == -1){
          this.setState({costOfAttendanceMin: null});
        }
        if(this.state.sizeMax == 999999){
          this.setState({sizeMax: null});
        }
        if(this.state.sizeMin == -1){
          this.setState({sizeMin: null});
        }
        if(this.state.rankingMax == 999999){
          this.setState({rankingMax: null});
        }
        if(this.state.rankingMin == -1){
          this.setState({rankingMin: null});
        }
        if(this.state.sATMathMax == 801){
          this.setState({sATMathMax: null});
        }
        if(this.state.sATMathMin == -1){
          this.setState({sATMathMin: null});
        }
        if(this.state.sATEBRWMax == 801){
          this.setState({sATEBRWMax: null});
        }
        if(this.state.sATEBRWMin == -1){
          this.setState({sATEBRWMin: null});
        }
        if(this.state.aCTCompositeMax == 41){
          this.setState({aCTCompositeMax: null});
        }
        if(this.state.aCTCompositeMin == -1){
          this.setState({aCTCompositeMin: null});
        }
        //
      });
   // LAX SEARCH
   }
   else{
    const allColleges = collegesRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let tempAddition = {
          AdmissionRate: doc.data().admission_rate,
          AvgACTComposite: doc.data().AvgACTComposite,
          AvgGPA: parseInt(doc.data().avg_gpa),
          AvgACTENG:(parseInt(doc.data().act_ENG75)+parseInt(doc.data().act_ENG25))/2 ,
          AvgACTMATH: (parseInt(doc.data().act_Math75)+parseInt(doc.data().act_Math25))/2 ,
          AvgSATEBRW: parseInt(doc.data().sat_ReadMid),
          AvgSATMath: (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2,
          CostOfAttendance: doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null,
          Location: doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null,
          Major1: doc.data().Major1,
          Major2: doc.data().Major2,
          Major3: doc.data().Major3,
          Name: doc.data().name,
          Ranking: doc.data().rank,
          Size: doc.data().num_ugrads,
          Recommendation: 0,
          SimilarProfiles: {}
        };
        console.log(tempAddition);
        console.log(this.state);
        //null checking
        if(this.state.admissionRateMax == null || this.state.admissionRateMax == ""){
          this.setState({admissionRateMax:101});
        }
        if(this.state.admissionRateMin == null || this.state.admissionRateMin == ""){
          this.setState({admissionRateMin:-1});
        }
        
        if(this.state.costOfAttendanceMax == null || this.state.costOfAttendanceMax == ""){
          this.setState({costOfAttendanceMax:999999});
        }
        if(this.state.costOfAttendanceMin == null || this.state.costOfAttendanceMin == ""){
          this.setState({costOfAttendanceMin: -1});
        }

        if(this.state.sizeMax == null || this.state.sizeMax == ""){
          this.setState({sizeMax: 999999});
        }
        if(this.state.sizeMin == null || this.state.sizeMin == ""){
          this.setState({sizeMin:-1});
        }

        if(this.state.rankingMax == null || this.state.rankingMax == ""){
          this.setState({rankingMax:999999});
        }
        if(this.state.rankingMin == null || this.state.rankingMin == ""){
          this.setState({rankingMin:-1});
        }

        if(this.state.sATMathMax == null || this.state.sATMathMax == ""){
          this.setState({sATMathMax:801});
        }
        if(this.state.sATMathMin == null || this.state.sATMathMin == ""){
          this.setState({sATMathMin:-1});
        }

        if(this.state.sATEBRWMax == null || this.state.sATEBRWMax == ""){
          this.setState({sATEBRWMax:801});
        }
        if(this.state.sATEBRWMin == null || this.state.sATEBRWMin == ""){
          this.setState({sATEBRWMin:-1});
        }

        if(this.state.aCTCompositeMax == null || this.state.aCTCompositeMax == ""){
          this.setState({aCTCompositeMax:41});
        }
        if(this.state.aCTCompositeMin == null || this.state.aCTCompositeMin == ""){
          this.setState({aCTCompositeMin:-1});
        }
        //
        if(((this.state.admissionRateMax >= doc.data().admission_rate*100) || (doc.data().admission_rate == null))
        && ((this.state.admissionRateMin <= doc.data().admission_rate*100) || (doc.data().admission_rate == null))
        && ((this.state.costOfAttendanceMax >= (doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null)) || (doc.data().tuition_fees == null))
        && ((this.state.costOfAttendanceMin <= (doc.data().tuition_fees ? parseInt(((doc.data().tuition_fees).replace(/,/g, '')).replace(/\$/g, '')) : null)) || (doc.data().tuition_fees == null))
        && ((this.state.sizeMax >= (doc.data().num_ugrads ? parseInt(((doc.data().num_ugrads).replace(/,/g, '')).replace(/\$/g, '')) : null)) || (doc.data().num_ugrads == null))
        && ((this.state.sizeMin <= (doc.data().num_ugrads ? parseInt(((doc.data().num_ugrads).replace(/,/g, '')).replace(/\$/g, '')) : null)) || (doc.data().num_ugrads == null))
        && ((this.state.rankingMax >= doc.data().rank) || (doc.data().rank == null))
        && ((this.state.rankingMin <= doc.data().rank) || (doc.data().rank == null))
        && ((this.state.sATMathMax >= (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2) || (doc.data().sat_Math25 == null))
        && ((this.state.sATMathMin <= (parseInt(doc.data().sat_Math25)+parseInt(doc.data().sat_Math75))/2) || (doc.data().sat_Math25 == null))
        && ((this.state.sATEBRWMax >= (parseInt(doc.data().sat_ReadMid))) || (doc.data().sat_ReadMid == null))
        && ((this.state.sATEBRWMin <= (parseInt(doc.data().sat_ReadMid))) || (doc.data().sat_ReadMid == null))
        && ((this.state.aCTCompositeMax >= doc.data().AvgACTComposite) || (doc.data().AvgACTComposite == null))
        && ((this.state.aCTCompositeMin <= doc.data().AvgACTComposite  ) || (doc.data().AvgACTComposite == null))
        ){
          //check for: filterName, major1/2, location
          if(this.state.filterName == "" && this.state.major1 == null && this.state.major2 == null && this.state.location == null){
            console.log("matched");
            collegeDict[doc.data().name] = tempAddition;
          }
          //if name !empty
          if(this.state.filterName != "" && (this.state.filterName.toLowerCase() == doc.data().name.toLowerCase() 
          || doc.data().name.toLowerCase().includes(this.state.filterName.toLowerCase()))){
            if(this.state.major1 == null && this.state.major2 == null && this.state.location == null){
              collegeDict[doc.data().name] = tempAddition;
            }
            if(this.state.major1 == null && this.state.major2 == null && this.state.location != null){
              if(this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false)){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 == null && this.state.major2 != null && this.state.location == null){
              if(this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 == null && this.state.major2 != null && this.state.location != null){
              if((this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
              && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 == null && this.state.location == null){
              if(this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 == null && this.state.location != null){
              if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
              && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 != null && this.state.location == null){
              if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
              && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 != null && this.state.location != null){
              if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
              && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
              && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
          }
          //
          if(this.state.filterName == "" ){
            if(this.state.major1 == null && this.state.major2 == null && this.state.location == null){
              collegeDict[doc.data().name] = tempAddition;
            }
            if(this.state.major1 == null && this.state.major2 == null && this.state.location != null){
              if(this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false)){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 == null && this.state.major2 != null && this.state.location == null){
              if(this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 == null && this.state.major2 != null && this.state.location != null){
              if((this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
              && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 == null && this.state.location == null){
              if(this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 == null && this.state.location != null){
              if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
              && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 != null && this.state.location == null){
              if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
              && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
            if(this.state.major1 != null && this.state.major2 != null && this.state.location != null){
              if((this.state.major1 == doc.data().Major1 || this.state.major1 == doc.data().Major2 || this.state.major1 == doc.data().Major3)
              && (this.state.major2 == doc.data().Major1 || this.state.major2 == doc.data().Major2 || this.state.major2 == doc.data().Major3)
              && (this.state.location == (doc.data().location ? doc.data().location.split(',')[1].replace(/\s/g, '') : null) || this.state.location == ""
              || (doc.data().location ? (this.state.region.includes(doc.data().location.split(',')[1].replace(/\s/g, ''))) : false))){
                collegeDict[doc.data().name] = tempAddition;
              }
            }
          }
        }
      });
    })
    .then(() => {
      Object.keys(collegeDict).forEach((college)=>{
        console.log(collegeDict[college]);
      })
      console.log(collegeDict);
      this.setState({colleges:collegeDict});
      this.sortTasks("name");
      alert("Finished Searching");
      //reset to nulls
      if(this.state.admissionRateMax == 101){
        this.setState({admissionRateMax : null});
      }
      if(this.state.admissionRateMin == -1){
        this.setState({admissionRateMin : null});
      }
      if(this.state.costOfAttendanceMax == 999999){
        this.setState({costOfAttendanceMax: null});
      }
      if(this.state.costOfAttendanceMin == -1){
        this.setState({costOfAttendanceMin: null});
      }
      if(this.state.sizeMax == 999999){
        this.setState({sizeMax: null});
      }
      if(this.state.sizeMin == -1){
        this.setState({sizeMin: null});
      }
      if(this.state.rankingMax == 999999){
        this.setState({rankingMax: null});
      }
      if(this.state.rankingMin == -1){
        this.setState({rankingMax: null});
      }
      if(this.state.sATMathMax == 801){
        this.setState({sATMathMax: null});
      }
      if(this.state.sATMathMin == -1){
        this.setState({sATMathMin: null});
      }
      if(this.state.sATEBRWMax == 801){
        this.setState({sATEBRWMax: null});
      }
      if(this.state.sATEBRWMin == -1){
        this.setState({sATEBRWMin: null});
      }
      if(this.state.aCTCompositeMax == 41){
        this.setState({aCTCompositeMax: null});
      }
      if(this.state.aCTCompositeMin == -1){
        this.setState({aCTCompositeMin: null});
      }
      //
    });
    console.log(this.state);
   }
    
  }

  sortTasks(sortingCriteria) {
    this.flip = false;
    this.newItemSortCriteria = sortingCriteria;
    let list = Object.entries(this.state.colleges);
    console.log(list);
    console.log(this.newItemSortCriteria+this.currentItemSortCriteria);
    if ( this.newItemSortCriteria === this.currentItemSortCriteria){
        this.flip = true;
    }
    if(this.flip && !this.flipped){
        if (this.newItemSortCriteria === "name"){
          list.sort(this.compareNameFlip);
        }
        else if(this.newItemSortCriteria === "ranking"){
          list.sort(this.compareRankingFlip);
        }
        else if(this.newItemSortCriteria === "admission"){
          list.sort(this.compareAdmissionFlip);
        }
        else if(this.newItemSortCriteria === "cost"){
          list.sort(this.compareCostFlip);
        }
        else if(this.newItemSortCriteria === "score"){
          list.sort(this.compareScoreFlip);
        }
        else if(this.newItemSortCriteria === "Recommendation"){
          list.sort(this.compareRecommendation);
        }
        else if(this.newItemSortCriteria === "sat_math"){
          list.sort(this.compareSATMathFlip);
        }
        else if(this.newItemSortCriteria === "sat_ebrw"){
          list.sort(this.compareSATEBRWFlip);
        }
        else if(this.newItemSortCriteria === "state"){
          list.sort(this.compareLocationFlip);
        }
        this.flipped = true;
    }
    else{
        if (this.newItemSortCriteria === "name"){
          list.sort(this.compareName);
        }
        else if(this.newItemSortCriteria === "ranking"){
          list.sort(this.compareRanking);
        }
        else if(this.newItemSortCriteria === "admission"){
          list.sort(this.compareAdmission);
        }
        else if(this.newItemSortCriteria === "cost"){
          list.sort(this.compareCost);
        }
        else if(this.newItemSortCriteria === "score"){
          list.sort(this.compareScore);
        }
        else if(this.newItemSortCriteria === "Recommendation"){
          list.sort(this.compareRecommendation);
        }
        else if(this.newItemSortCriteria === "sat_math"){
          list.sort(this.compareSATMath);
        }
        else if(this.newItemSortCriteria === "sat_ebrw"){
          list.sort(this.compareSATEBRW);
        }
        else if(this.newItemSortCriteria === "state"){
          list.sort(this.compareLocation);
        }
        this.flipped = false;
    }
    let newList = {};
    list.map((data)=>{
      console.log(data);
      newList[data[0]] = data[1];
    })

    console.log(newList);
    this.setState({colleges:newList});
    this.currentItemSortCriteria = sortingCriteria;
    this.setState({colleges:newList});
  }

  // SORT BY NAME
  compareName(item1,item2) {
    if (item1[0] < item2[0])
        return -1;
    else if (item1[0] > item2[0])
        return 1;
    else
        return 0;
  }

  compareNameFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (item1[0] < item2[0])
        return -1;
    else if (item1[0] > item2[0])
        return 1;
    else
        return 0;
  }

  // SORT BY Ranking
  compareRanking(item1,item2) {
    if (isNaN(parseInt(item1[1]["Ranking"])))
      return -1;
    if (isNaN(parseInt(item2[1]["Ranking"])))
      return 1;
    if (parseInt(item1[1]["Ranking"]) < parseInt(item2[1]["Ranking"]))
        return -1;
    else if (parseInt(item1[1]["Ranking"]) > parseInt(item2[1]["Ranking"]))
        return 1;
    else
        return 0;
  }

  compareRankingFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (isNaN(parseInt(item1[1]["Ranking"])))
      return -1;
    if (isNaN(parseInt(item2[1]["Ranking"])))
      return 1;
    if (parseInt(item1[1]["Ranking"]) < parseInt(item2[1]["Ranking"]))
        return -1;
    else if (parseInt(item1[1]["Ranking"]) > parseInt(item2[1]["Ranking"]))
        return 1;
    else
        return 0;
  }

  // SORT BY Admission Rate
  compareAdmission(item1,item2) {
    if (isNaN(item1[1]["AdmissionRate"]))
      return -1;
    if (isNaN(item2[1]["AdmissionRate"]))
      return 1;
    if (item1[1]["AdmissionRate"] < item2[1]["AdmissionRate"])
        return -1;
    else if (item1[1]["AdmissionRate"] > item2[1]["AdmissionRate"])
        return 1;
    else
        return 0;
  }

  compareAdmissionFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (isNaN(item1[1]["AdmissionRate"]))
      return -1;
    if (isNaN(item2[1]["AdmissionRate"]))
      return 1;
    if (item1[1]["AdmissionRate"] < item2[1]["AdmissionRate"])
        return -1;
    else if (item1[1]["AdmissionRate"] > item2[1]["AdmissionRate"])
        return 1;
    else
        return 0;
  }

  // SORT BY Cost
  compareCost(item1,item2) {
    if (isNaN(item1[1]["CostOfAttendance"]))
      return -1;
    if (isNaN(item2[1]["CostOfAttendance"]))
      return 1;
    if (item1[1]["CostOfAttendance"] < item2[1]["CostOfAttendance"])
        return -1;
    else if (item1[1]["CostOfAttendance"] > item2[1]["CostOfAttendance"])
        return 1;
    else
        return 0;
  }

  compareCostFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (isNaN(item1[1]["CostOfAttendance"]))
      return -1;
    if (isNaN(item2[1]["CostOfAttendance"]))
      return 1;
    if (item1[1]["CostOfAttendance"] < item2[1]["CostOfAttendance"])
        return -1;
    else if (item1[1]["CostOfAttendance"] > item2[1]["CostOfAttendance"])
        return 1;
    else
        return 0;
  }
  //SORT By Recommendation
  compareRecommendation(item1,item2){
    
    if(item1[1]["Recommendation"] && item2[1]["Recommendation"])
    {
    if (item1[1]["Recommendation"] > item2[1]["Recommendation"])
      return -1;
    else if (item1[1]["Recommendation"] < item2[1]["Recommendation"])
      return 1;
    else
      return 0;
    }
    else if(item1[1]["Recommendation"])
      return -1;
    else
      return 0;

}

  // SORT BY Score
  compareScore(item1,item2) {
    if (item1[1]["Ranking"] < item2[1]["Ranking"])
        return -1;
    else if (item1[1]["Ranking"] > item2[1]["Ranking"])
        return 1;
    else
        return 0;
  }

  compareScoreFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (item1[1]["Ranking"] < item2[1]["Ranking"])
        return -1;
    else if (item1[1]["Ranking"] > item2[1]["Ranking"])
        return 1;
    else
        return 0;
  }

  // SORT BY SAT EBRW
  compareSATEBRW(item1,item2) {
    if (isNaN(item1[1]["AvgSATEBRW"]))
      return -1;
    if (isNaN(item2[1]["AvgSATEBRW"]))
      return 1;
    if (item1[1]["AvgSATEBRW"] < item2[1]["AvgSATEBRW"])
        return -1;
    else if (item1[1]["AvgSATEBRW"] > item2[1]["AvgSATEBRW"])
        return 1;
    else
        return 0;
  }

  compareSATEBRWFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (isNaN(item1[1]["AvgSATEBRW"]))
      return -1;
    if (isNaN(item2[1]["AvgSATEBRW"]))
      return 1;
    if (item1[1]["AvgSATEBRW"] < item2[1]["AvgSATEBRW"])
        return -1;
    else if (item1[1]["AvgSATEBRW"] > item2[1]["AvgSATEBRW"])
        return 1;
    else
        return 0;
  }

  // SORT BY SAT Math
  compareSATMath(item1,item2) {
    if (isNaN(item1[1]["AvgSATMath"]))
      return -1;
    if (isNaN(item2[1]["AvgSATMath"]))
      return 1;
    if (item1[1]["AvgSATMath"] < item2[1]["AvgSATMath"])
        return -1;
    else if (item1[1]["AvgSATMath"] > item2[1]["AvgSATMath"])
        return 1;
    else
        return 0;
  }

  compareSATMathFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (isNaN(item1[1]["AvgSATMath"]))
      return -1;
    if (isNaN(item2[1]["AvgSATMath"]))
      return 1;
    if (item1[1]["AvgSATMath"] < item2[1]["AvgSATMath"])
        return -1;
    else if (item1[1]["AvgSATMath"] > item2[1]["AvgSATMath"])
        return 1;
    else
        return 0;
  }

  // SORT BY State
  compareLocation(item1,item2) {
    if (item1[1]["Location"] < item2[1]["Location"])
        return -1;
    else if (item1[1]["Location"] > item2[1]["Location"])
        return 1;
    else
        return 0;
  }

  compareLocationFlip(item1,item2) {
    let temp = item1;
    item1 = item2;
    item2 = temp;
    if (item1[1]["Location"] < item2[1]["Location"])
        return -1;
    else if (item1[1]["Location"] > item2[1]["Location"])
        return 1;
    else
        return 0;
  }

  handleChange = (e) =>{
    const { target } = e;

    this.setState(state => ({
      ...state,
      [target.id]: target.value,
    }));
  }

  handleChangeScore = (e) =>{
    const { target } = e;

    this.setState(state => ({
      ...state,
      [target.id]: (isNaN(parseInt(target.value)) ? null : parseInt(target.value)),
    }));
    console.log(this.state);
  }

  handleCheck = (e) =>{
    const { target } = e;

    this.setState(state => ({
      ...state,
      ["filterType"]: target.id,
    }));
  }

  handleSelect = (e) =>{
    const { target } = e;
    console.log(target);
    console.log(target.value);

    this.setState(state => ({
      ...state,
      [target.id]: target.value,
    }));

    if( target.value === "Northeast"){
      this.setState(state => ({
        ...state,
        region: this.state.northeast,
      }));
    }
    else if( target.value === "Midwest"){
      this.setState(state => ({
        ...state,
        region: this.state.midwest,
      }));
    }
    else if( target.value === "South"){
      this.setState(state => ({
        ...state,
        region: this.state.south,
      }));
    }
    else if( target.value === "West"){
      this.setState(state => ({
        ...state,
        region: this.state.west,
      }));
    }
    else{
      this.setState(state => ({
        ...state,
        region: [],
      }));
    }
    console.log(this.state);
  }

  componentDidMount(){
    document.getElementById("strict").checked = true;
  }
  /*
  setNull = (e) =>{
    let collegeRef = db.collection('Colleges').doc("Fq3BSuaMXuNI2YO0dXuL").set({
      AdmissionRate: 74,
      AvgACTComposite: null,
      AvgSATEBRW: 502,
      AvgSATMath: 490,
      CostOfAttendance: null,
      Location: "West",
      Major1: "Business",
      Major2: "Health Sciences",
      Major3: "Social Sciences",
      Name: "California State University, East Bay",
      Ranking:  450,
      Size: 12998
    });
  }
  */


  computeRecommendation(){
     
     let profile={};
     
     let temp2 = this.props.auth.email;
     let currentProf ={};
     
     console.log("value of t1 in ComputeRecommendation", temp2);
     let studentProfile = db.collection('studentProfiles');
     let temp1 = studentProfile.get().
     then(snapshot => {
      snapshot.forEach(doc => {
      
          profile[doc.data().email]={
            act_composite: doc.data().act_composite,
            act_english: doc.data().act_english,
            act_math: doc.data().act_math,
            act_reading: doc.data().act_reading,
            act_science: doc.data().act_science,
            gpa: doc.data().gpa,
            email: doc.data().email,
            num_ap_passed: doc.data().num_ap_passed,
            applied_colleges: doc.data().applied_colleges,
            residence_state: doc.data().residence_state,
            sat_chemistry: doc.data().sat_chemistry,
            sat_ebrw: doc.data().sat_ebrw,
            sat_eco_bio: doc.data().sat_eco_bio,
            sat_literature: doc.data().sat_literature,
            sat_math: doc.data().sat_math,
            sat_math_i: doc.data().sat_math_i,
            sat_math_ii: doc.data().sat_math_ii,
            sat_mol_bio: doc.data().sat_mol_bio,
            sat_physics: doc.data().sat_physics,
            sat_us_hist: doc.data().sat_us_hist,
            sat_world_hist: doc.data().sat_world_hist
          }
        
      });
    }).then( ()=> {
     // console.log("value of profile before",profile[this.props.auth.email]);
       currentProf = profile[temp2];
      delete profile[temp2];
      
       console.log("value of profile after", profile);
       console.log("Value of Colleges", this.state.colleges);
      if(this.props.auth.email != "amta.sulaiman@stonybrook.edu"){
       let rec =0;
       let temp;
       let i = 0;
       for(var key in profile){
         rec = 0;
         temp = profile[key];
         console.log("Current profile comparison:", temp);
         //act english
         if(temp.act_english && currentProf.act_english)
           rec  += this.compareScores(temp.act_english, currentProf.act_english, 36.00);
         else
           rec += 0.70;
 
         if(temp.act_math && currentProf.act_math)
           rec  += this.compareScores(temp.act_math, currentProf.act_math, 36.00);
         else
           rec += 0.70;
       
         if(temp.act_reading && currentProf.act_reading)
           rec  += this.compareScores(temp.act_reading, currentProf.act_reading, 36.00);
         else
           rec += 0.70;
 
         if(temp.act_science && currentProf.act_science)
           rec  += this.compareScores(temp.act_science, currentProf.act_science, 36.00);
         else
           rec += 0.70;
         //sat score comparisons
         if(temp.sat_ebrw && currentProf.sat_ebrw)
           rec  += this.compareScores(temp.sat_ebrw, currentProf.sat_ebrw, 800.00);
         else
           rec += 0.70;
         if(temp.sat_math && currentProf.sat_math)
           rec  += this.compareScores(temp.sat_math, currentProf.sat_math, 800.00);
         else
           rec += 0.70;
         if(temp.sat_chemistry && currentProf.sat_chemistry)
           rec  += this.compareScores(temp.sat_chemistry, currentProf.sat_chemistry, 800.00);
         else
           rec += 0.70;
         if(temp.sat_physics && currentProf.sat_physics)
           rec  += this.compareScores(temp.sat_physics, currentProf.sat_physics, 800.00);
         else
           rec += 0.70;
 
         //compare GPA
         if(temp.gpa && currentProf.gpa)
           rec  += (this.compareScores(temp.gpa, currentProf.gpa, 4.0))*4;
         else
           rec += 2.80;
         
         //compare state
         if((temp.residence_state) && (currentProf.residence_state))
           rec += this.compareStrings(temp.residence_state, currentProf.residence_state);
         else
           rec += 0.25;
   
         console.log("Recommendation Score is:", rec);
         if(temp.applied_colleges){
           
           
           console.log("applied college are:",Object.keys(temp.applied_colleges));
           for(var key in this.state.colleges){
             if( (Object.keys(temp.applied_colleges)).includes(key) ){
                console.log("current:", key, temp.email);
                i = i+1;
                this.state.colleges[key].Recommendation += rec;
                console.log("The Rec is:", this.state.colleges[key].Recommendation )
                temp.rec = rec;
                this.state.colleges[key].SimilarProfiles[i] = temp ;

              }
           }
         }
       }
      }
 
      //console.log("Sorting Now");
       
      this.sortTasks("Recommendation");

    });


  }


   compareScores(a,b, total){
    let score = 0;
    if (a == b){
      return 1;
    }
    let difference = Math.abs(a - b);
    score = (total - difference) / total;
  //  console.log("value in compareScores is: difference, score",difference, score);
    return score;
  }
  compareStrings(a,b){
    if(a!=null){
    if(a.toLowerCase()==b.toLowerCase()){
        return 0.25;
    }
  }
    return 0;
  }
  render() {
    return (
      <div className="outlet college-search-outlet">

        {/* Contains all Filter Information */}

        {/* All Sliders can be ranges as well

        Name (Text)
        Admission Rate (Slider)
        Cost of Attendance (Slider)
        Location (Select)
        Major(s) (Select, 2)
        Size (Slider)
        Ranking (Slider)
        Average Test Scores (Label)
        -SAT Math (Slider)
        -SAT EBRW (Slider)
        -ACT Composite (Slider)

        Filter Type (Radio)  */}
        <div className="filter-container">
          <div className="filter-header">
            Filters
          </div>


          <form onSubmit={this.handleSubmit}>
            <div className="filter-item">
              <div className="filter-name-label">Name:</div>
              <div className="filter-name">
                <input className="filter-name" type="text" id="filterName" onChange={this.handleChange} ></input>
              </div>
            </div>
            
            <RangeInput
              handleChange={this.handleChangeScore}
              min={0}
              max={5}
              suffix={"%"}>
              Admission Rate
            </RangeInput>

            <RangeInput
              handleChange={this.handleChangeScore}
              min={0}
              max={5}
              prefix={"$"}>
              Cost Of Attendance
            </RangeInput>

            <SelectorInput
              handleChange={this.handleSelect}
              options={this.state.locations}>
              Location
            </SelectorInput>

            <RangeInput
              handleChange={this.handleChangeScore}
              min={0}
              max={5}>
              Size
            </RangeInput>

            <RangeInput
              handleChange={this.handleChangeScore}
              min={0}
              max={150}>
              Ranking
            </RangeInput>

            <div className="filter-score-label">
              Major(s)
            </div>

            <div className="filter-item">
              <div className="filter-name-label">Major 1:</div>
              <div className="filter-name">
                <input className="filter-name" type="text" id="major1" onChange={this.handleChange} ></input>
              </div>
            </div>
            <div className="filter-item">
              <div className="filter-name-label">Major 2:</div>
              <div className="filter-name">
                <input className="filter-name" type="text" id="major2" onChange={this.handleChange} ></input>
              </div>
            </div>

            <div className="filter-majors-spacer"></div>

            <div className="filter-score-label">
              Average Test Scores:
            </div>

            <div className="filter-scores">
              <RangeInput
                handleChange={this.handleChangeScore}
                min={0}
                max={800}>
                SAT Math
              </RangeInput>

              <RangeInput
                handleChange={this.handleChangeScore}
                min={0}
                max={800}>
                SAT EBRW
              </RangeInput>

              <RangeInput
                handleChange={this.handleChangeScore}
                min={0}
                max={40}>
                ACT Composite
              </RangeInput>
            </div>

            <div className="filter-majors-label">
              Filter Type:
            </div>

            <Row>
              <Col s={1}>
                
              </Col>
              <Col s={4}>
                <label className="filter-radio">Strict
                  <input onChange={this.handleCheck} id="strict" name="filter-type-sl" className="filter-radio-option" type="radio"/>
                </label>
              </Col>
              <Col s={4}>
                <label className="filter-radio">Lax
                  <input onChange={this.handleCheck} id="lax" name="filter-type-sl" className="filter-radio-option" type="radio"/>
                </label>
              </Col>
            </Row>

            <Row>
              <Col s={1}>

              </Col>
              <Col s={5}>
                <button type="submit" className="btn green lighten-1">Search</button>
              </Col>
            </Row>
          </form>
          
          
          

        </div>

        {/* Contains all listing information */}
        <div className="college-list-container">
          {Object.keys(this.state.colleges).length >0 ? (
            <div>
              <div className="search-num-colleges">
                {Object.keys(this.state.colleges).length} colleges found...
              </div>
              <table className="striped">
                <thead>
                  <tr>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("name")}>Name</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("state")}>State</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("ranking")}>Ranking</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("admission")}>Admission Rate</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("sat_math")}>Avg SAT Math</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("sat_ebrw")}>Avg SAT EBRW</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.sortTasks("cost")}>Cost of Attendance</a></th>
                      <th className="search-header"><a className="search-header-text" onClick={()=>this.computeRecommendation()}>Rec. Score</a></th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(this.state.colleges).map((college) => {
                    let temp = this.state.colleges[college];
                    return  <tr className="search-item">
                                <td className="search-item-name"><Link to={{pathname: "/college/"+college, info: {temp}}} className="search-item-name">{college}</Link></td>
                                
                                {temp["Location"] ? (<td className="search-item">{temp["Location"]}</td>) : (<td className="search-item">N/A</td>)}

                                {temp["Ranking"] ? (<td className="search-item">{temp["Ranking"]}</td>) : (<td className="search-item">N/A</td>)}
                                
                                {temp["AdmissionRate"] ? (<td className="search-item">{(temp["AdmissionRate"]*100).toFixed(2)}%</td>) : (<td className="search-item">N/A</td>)}

                                {temp["AvgSATMath"] ? (<td className="search-item">{temp["AvgSATMath"]}</td>) : (<td className="search-item">N/A</td>)}

                                {temp["AvgSATEBRW"] ? (<td className="search-item">{temp["AvgSATEBRW"]}</td>) : (<td className="search-item">N/A</td>)}
                                
                                {temp["CostOfAttendance"] ? (<td className="search-item">${temp["CostOfAttendance"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>) : (<td className="search-item">N/A</td>)}
                                
                                {temp["Recommendation"] ? (<td className="search-item"><Collapsible trigger ={temp["Recommendation"].toFixed(3)} triggerStyle={{fontWeight:"bold"}}>
                                  <p>StudentProfile:SimilarityRatio
                                  {Object.values(temp["SimilarProfiles"]).map(el => "\n"+el.email+":"+el.rec.toFixed(2) )}</p></Collapsible> </td>) 
                                  : (<td className="search-item">-</td>)}
                      
                                <td className="search-item"></td>
                            </tr>
                  })}
                </tbody>
              </table>
            </div>
          ) : (<div className="search-num-colleges">
            Please enter any criteria in the filters provided and select "Search."
            <br />
            <br />
            Strict Filtering:  If the college is missing any information you have specified, it will not show up in the list of results.
            <br />
            Lax Filtering: If the college is missing any information you have specified, it will STILL show up in the list of results.
  
          </div>)}
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
      profileInfo: state.firestore.data,
      auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(),
)(CollegeSearchScreen);

