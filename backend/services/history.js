import express from "express";
import queriesDB from "../database/queriesDB.js"




export const viewHistory = (req, res, next) => {

  try {
    const userRides = queriesDB.viewingHistory(req, res, next)


  } catch (error) {
    
  }

  



};





