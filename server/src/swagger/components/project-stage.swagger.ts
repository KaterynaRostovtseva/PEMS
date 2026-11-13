export const projectStageSchemas = {

 ProjectStage: {

  type:"object",

  properties:{

    id:{
      type:"string",
      format:"uuid",
    },


    projectId:{
      type:"string",
      format:"uuid",
    },


    name:{
      type:"string",
      example:"Development",
    },


    order:{
      type:"integer",
      example:1,
    },


    status:{
      $ref:
        "#/components/schemas/StageStatus",
    },


    createdAt:{
      type:"string",
      format:"date-time",
    },


  },

 },


 ProjectStageHistory: {

  type:"object",

  properties:{

    id:{
      type:"string",
      format:"uuid",
    },


    stageId:{
      type:"string",
      format:"uuid",
    },


    fromStage:{
      type:"string",
      nullable:true,
    },


    toStage:{
      type:"string",
    },


    changedById:{
      type:"string",
      format:"uuid",
    },


    createdAt:{
      type:"string",
      format:"date-time",
    },


  },

 },


};