const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const axios = require("axios")
const bodyParser = require("body-parser");
// app.use(bodyParser.json())

app.use(express.json({
    limit : "100mb"
}));
app.use(express.urlencoded({
    limit:"100mb",
    extended: false
}));


const bcrypt = require("bcrypt")

const jwt = require('jsonwebtoken');
// const secretKey = require('./config/jwt')
const SECRET_KEY = "secretKey";

//db 설정


var db;
MongoClient.connect(process.env.DB_URL, function (에러, client) {
  if (에러) return console.log(에러);
  db = client.db("CUT");

  app.listen(process.env.PORT, function () {
    console.log("listening on 8080");
  });
});



//로그인
const passport = require("passport");

//--------------------- xr  통신

// app.post("/rbals", (요청, 응답) => {
//   const xrdata = 요청.body;
//   console.log("규민이 와썽용");
//   console.log(xrdata);
//   console.log(typeof(xrdata));

//   // xrdata -> 디비에 저장하는 코드
//   응답.status(200).json({ good: "한이 와썽용" });
// });

//--ㅊ창우손

app.post("/chatBot", async (요청, 응답) => {
    const xrdata = 요청.body;
    console.log("규민이 와썽용");
    console.log(xrdata);
    console.log(xrdata.contents)
    console.log(요청.body.contents)
    // aiCall(xrdata);
  
    
    db.collection("aiTest").insertOne(
      { key: xrdata.key, contents: xrdata.contents },
    
      // function (에러, 결과) {
      //   응답.send("에러");
      // }
    );
  
    const aidata2 = await aiCall(xrdata)
    
    // JSON.stringify(aidata2); //그냥 member 사용하면 error 발생!
    // const aidata3 = JSON.stringify(aidata2);
  
    aidata2 
    console.log(aidata2)
  
    // aidata2 = parseConnectionString(aidata2);
  
    응답.status(200).json({ good: aidata2 });
  });
  
  
//---------------------------회원가입

app.post("/signUp", function(요청, 응답){
    const xrlogin_id = 요청.body.id;
    const xrlogin_pw = 요청.body.pw;
    const xrlogin_nickname = 요청.body.nickname;

    const salt = 10;


    // //비동기 콜백
    // bcrypt.hash(xrlogin_pw, salt, (err, encryptedPW) => {

    // })
    
    //동기 콜백
    //암호화 비크립트 처리
    const xrlogin_pw2 = bcrypt.hashSync(xrlogin_pw, salt);
    // hashSync 동기

    // const hash = await bcrypt.hash(xrlogin_pw, slat);
    // async/ await 사용 
    console.log("회원가입 아이디 : " + xrlogin_id)
    console.log("회원가입 암호화전 비번 :" + xrlogin_pw)
    console.log("회원가입 암호화 완료 비번 : " + xrlogin_pw2)
    console.log("닉네임 :" + xrlogin_nickname)

    console.log("규민이 회원가입 와썽용");
    // console.log(xrlogin);
    
    db.collection("login").findOne({id :xrlogin_id},function(에러,결과){
      if (결과 == null){
        
        db.collection("login").insertOne(
          { id:xrlogin_id, pw: xrlogin_pw2, nickname: xrlogin_nickname},
          응답.status(200).json({good : "nice"})
          // function (에러, 결과) {
          // if(에러){
          //   응답.status(200).json({ good: "규민아 있는 아이디란다 .... "});
          // }}
        );
        db.collection("avatar").insertOne(
            { id:xrlogin_id,
    
                gender: "male"
                , bodyType: 0
                , hairType: 0
                , shirtsType: 0 
                , legsType: 0
                , feetsType: 0
                , glassesType: 0
                , hatType: 0
                , shirtsTexture: 0
                , legsTexture: 0
                , feetsTexture: 0
                , hatsTexture: 0
                , hairColor: "#FFFFFF"
                , shirtsColor: "#FFFFFF"
                , legsColor: "#FFFFFF"
                , feetsColor: "#FFFFFF"
                , glassesColor: "#FFFFFF"
                , hatsColor: "#FFFFFF"
                  
            }
        )
      }
      else{
        console.log("아이디없음")
        응답.status(200).json({good :"아이디중복임ㅁ요"})
        
      }
    }
    )  

    // 응답.status(200).json({ good : "nice"})
  })
  
  //----------------------로그인 검사하기
  
  app.post("/login", function(요청, 응답){
    const xrlogin_id = 요청.body.id;
    const xrlogin_pw = 요청.body.pw;
    console.log("규민로그인 와썽용");
    console.log("아이디 : " + xrlogin_id);
    console.log("비번 : " + xrlogin_pw);
  
    //암호화된 비번 찾기


    // console.log("암호화 된 비번 : " + xrlogin_pw2);
    // bcrypt.compare(xrlogin_pw , xrlogin_pw2, (err ,same) => {
    //     console.log("암호화된 비번 :" + xrlogin_pw);
    //     console.log("db에 저장된 비번 :" + xrlogin_pw2)
    //     db.collection("login").findOne({ id: xrlogin_id, pw:xrlogin_pw}
    
    //         // , function (에러, 결과) {
    //         // done(null, 결과)}
    //         );
        
    //         // function (에러, 결과) {
    //         //   응답.redirect("/");
    //         // }
        
    //       응답.status(200).json({ good: "한이 암호화 로그인 가능이용"})
    // })




    //동기방식
        //login
    // db.collection("avatar").findOne({ id: xrlogin_id}, function(에러, 결과){
    //     if(에러){console.log}
    // })


    try{
    db.collection('avatar').findOne({id: xrlogin_id},function(에러,결과){
        if (결과 == null){
            console.log("아이디없음")
            응답.status(200).json({good :"아이디없음요"})
        }
        else{
        console.log(결과.gender)
        console.log("아바타 아이디 찾기 완료")
        beforeGender = 결과.gender
        beforeBodyType = 결과.bodyType
        beforeHairType = 결과.hairType
        beforeShirtsType = 결과.shirtsType
        beforeLegsType = 결과.legsType
        beforeFeetsType = 결과.feetsType
        beforeGlassesType = 결과.glassesType
        beforeHatType = 결과.hatType

        beforeShirtsTexture = 결과.shirtsTexture
        beforeLegsTexture = 결과.legsTexture
        beforeFeetsTexture = 결과.feetsTexture
        beforeHatsTexture = 결과.hatsTexture

        beforeHairColor = 결과.hairColor
        beforeShirtsColor = 결과.shirtsColor
        beforeLegsColor = 결과.legsColor
        beforeFeetsColor = 결과.feetsColor
        beforeGlassesColor = 결과.glassesColor
        beforeHatsColor = 결과.hatsColor

        
            db.collection("login").findOne({ id: xrlogin_id}, function(에러, 결과){
                if(에러){console.log(에러)
                    return 응답.status(200).json({ good: "없는 아이디임"})
                }
                if(결과 ==  null){
                return 응답.status(200).json({ good: "bad"});
                }
                    if (bcrypt.compareSync(xrlogin_pw,결과.pw)){
                    console.log("결과 pw 출력값 : " + 결과.pw)
                    

                    const userId = xrlogin_id; 
                    // jwt 토큰 

                    token = jwt.sign(
                        {
                        type : 'JWT',
                        id : userId,
                        }, SECRET_KEY, {
                        expiresIn: '20m', //만료시간 20 분
                        issuer: 'Choi_Han'
                        });

                        // if (!token || token === 'null') {
                        //     응답.status(200).json({
                        //         good: "로그인 해라"
                        //     })
                        // } else {
                        //         jwt.verify(token, SECRET_KEY, (err, decoded) => {
                        //             if(err){
                        //                 응답.status(200).json({ 
                        //                     good: "토큰만료됨"
                        //                 });
                        //             } else {
                        //                 결과.decoded = decoded,
                        //                 응답.status(200).json({good: "nice"});
                        //             };
                                    
                        //         });
                        // }
                        //응답
                        응답.cookie('jwt',token)
                        return 응답.status(200).json({
                        code: 200,
                        good: 'nice',
                        jwt: token,
                        
                          gender: beforeGender 
                        , bodyType: beforeBodyType 
                        , hairType: beforeHairType 
                        , shirtsType: beforeShirtsType 
                        , legsType: beforeLegsType 
                        , feetsType: beforeFeetsType 
                        , glassesType: beforeGlassesType 
                        , hatType: beforeHatType 
            
                        , shirtsTexture: beforeShirtsTexture 
                        , legsTexture: beforeLegsTexture 
                        , feetsTexture: beforeFeetsTexture
                        , hatsTexture :beforeHatsTexture
            
                        , hairColor: beforeHairColor 
                        , shirtsColor: beforeShirtsColor 
                        , legsColor: beforeLegsColor 
                        , feetsColor: beforeFeetsColor
                        , glassesColor: beforeGlassesColor 
                        , hatsColor : beforeHatsColor
                        //db에 있는 아바타 정보를 꺼내서 보내주세요
                        //db에 있는 값을 찾아 -> 

                        
                        
                        });

                    } 
                    응답.status(200).json({ good: "bad"})
                }
                    // , function (에러, 결과) {
                    // done(null, 결과)}
                    )};
                
                    // function (에러, 결과) {
                    //   응답.redirect("/");
                    // } 응답.status(200).json({ good: "bad"}
                

    // else{
    //   console.log("아이디비번 일치하지 않음");
    //   응답.status(200).json({ good: "bad"});
    // }
    })}
    catch(에러){
        console.log("에러 원인 :"+ 에러)
    }
        });


  //-----------------아바타 db셋

  app.post("/avatar",function(요청,응답){
     
    console.log("규민이 아바타 와썽용")

    const jwt = 요청.body.jwt;

    console.log("JWT 토큰 : " + jwt )
    const xrlogin_id = 요청.body.id;
    
    const gender = 요청.body.gender;
    const bodyType = 요청.body.bodyType;

    const hairType = 요청.body.hairType;
    const shirtsType = 요청.body.shirtsType;
    const legsType = 요청.body.legsType;
    const feetsType = 요청.body.feetsType;
    const glassesType = 요청.body.glassesType;
    const hatType = 요청.body.hatType;

    const shirtsTexture = 요청.body.shirtsTexture;
    const legsTexture = 요청.body.legsTexture;
    const feetsTexture = 요청.body.feetsTexture;
    const hatsTexture = 요청.body.hatsTexture;

    const hairColor = 요청.body.hairColor;
    const shirtsColor = 요청.body.shirtsColor;
    const legsColor = 요청.body.legsColor;
    const feetsColor = 요청.body.feetsColor;
    const glassesColor = 요청.body.glassesColor;
    const hatsColor = 요청.body.hatsColor;

    // const zeroTest = 0;
    // const zeroTest2 = "0";

    // find로 디비를 찾고 안에 잇는 아바타 정보를 업데이트 시키기
    
    //db찾기
    //db.collection('login').findOne({id : xrlogin_id}, function(에러, 결과){

    // })
    db.collection('avatar').findOne({id: xrlogin_id}, function(에러 , 결과){
        // console.log(결과.gender)
        console.log("아바타 아이디 찾기 완료")
        beforeGender = 결과.gender
        beforeBodyType = 결과.bodyType
        beforeHairType = 결과.hairType
        beforeShirtsType = 결과.shirtsType
        beforeLegsType = 결과.legsType
        beforeFeetsType = 결과.feetsType
        beforeGlassesType = 결과.glassesType
        beforeHatType = 결과.hatType

        beforeShirtsTexture = 결과.shirtsTexture
        beforeLegsTexture = 결과.legsTexture
        beforeFeetsTexture = 결과.feetsTexture
        beforeHatsTexture = 결과.hatsTexture

        beforeHairColor = 결과.hairColor
        beforeShirtsColor = 결과.shirtsColor
        beforeLegsColor = 결과.legsColor
        beforeFeetsColor = 결과.feetsColor
        beforeGlassesColor = 결과.glassesColor
        beforeHatsColor = 결과.hatsColor

        db.collection('avatar').updateOne({
              gender: beforeGender 
            , bodyType: beforeBodyType 
            , hairType: beforeHairType 
            , shirtsType: beforeShirtsType 
            , legsType: beforeLegsType 
            , feetsType: beforeFeetsType 
            , glassesType: beforeGlassesType 
            , hatType: beforeHatType 

            , shirtsTexture: beforeShirtsTexture 
            , legsTexture: beforeLegsTexture 
            , feetsTexture: beforeFeetsTexture
            , hatsTexture :beforeHatsTexture

            , hairColor: beforeHairColor 
            , shirtsColor: beforeShirtsColor 
            , legsColor: beforeLegsColor 
            , feetsColor: beforeFeetsColor
            , glassesColor: beforeGlassesColor 
            , hatsColor : beforeHatsColor
                      
        
            },{ $set : {
                gender: gender
                , bodyType: bodyType
                , hairType: hairType
                , shirtsType: shirtsType
                , legsType: legsType
                , feetsType: feetsType
                , glassesType: glassesType
                , hatType: hatType
                , shirtsTexture: shirtsTexture
                , legsTexture: legsTexture
                , feetsTexture: feetsTexture
                , hatsTexture: hatsTexture
                , hairColor: hairColor
                , shirtsColor: shirtsColor
                , legsColor: legsColor
                , feetsColor: feetsColor
                , glassesColor: glassesColor
                , hatsColor: hatsColor

            }},function(에러, 결과){
            if(에러){return consol.log(에러)}
            console.log("아바타 수정완료")
        })
    })

    //     console.log("규민이 로그인 셀렉트")
    //     db.collection("avatar").updateOne(
    //       { gender: gender
    //       , bodyType: bodyType
    //       , hairType: hairType
    //       , shirtsType: shirtsType 
    //       , legsType: legsType
    //       , feetsType: feetsType
    //       , glassesType: glassesType
    //       , hatType: hatType
    //       , shirtsTexture: shirtsTexture
    //       , legsTexture: legsTexture
    //       , feetsTexture: feetsTexture
    //       , hatsTexture: hatsTexture
    //       , hairColor: hairColor
    //       , shirtsColor: shirtsColor
    //       , legsColor: legsColor
    //       , feetsColor: feetsColor
    //       , glassesColor: glassesColor
    //       , hatsColor: hatsColor
    //     },
    //     function(에러, 결과){
    //     console.log("규민이 로그인 업뎃");
    //   }
    //     )    
      // function (에러, 결과) {
      //   응답.redirect("/");
      // }
  

     응답.status(200).json({ good: "한이 아바타 세팅 완료 "})
  });




  
    ///-0---- ai 통신 11.12  
    const aiCall = (xrdata) =>
    axios({
    method: "post", // 요청 방식
    url: "http://192.168.0.219:5003", // 요청 주소
    data: {
        id: "aidata_1",
        contents: xrdata // contents 는 xr ai와 협의한 변수명 사용
    }, // 제공 데이터(body)
    })
    .then(function (res) {
        console.log(res.data);
        return res.data;
    })
    .catch(function (err) {
        console.log(err); // 에러 처리 내용
    });



    // ai 통신(xr없이 테스트 )
//     const aidata = axios({
//   method: "post", // 요청 방식
//   url: "http://192.168.0.11:5003", // 요청 주소
//   data: {
//     id: "aidata_1",
//     contents: "영화 스파이더맨 정보",
//   }, // 제공 데이터(body)
// })
//   .then(function (res) {
//     console.log(res.data);
//     return res.data;
//   })
//   .catch(function (err) {
//     console.log(err); // 에러 처리 내용
//   })


//토큰 검증 , 없는 아이디 로그인시 서버 터짐


///----------------------------------아란이 통신

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// // after
// app.use(bodyParser.json({limit: '50mb'}))


app.post("/img", function(요청, 응답){

    console.log(요청.body)
    
    const xrlogin_id = 요청.body.id;
    const imageData = 요청.body.bytes;
    console.log("아이디 : "  + xrlogin_id)
  
    //파싱
    const jsonImageData = JSON.stringify(imageData)


    console.log("아란이와썽용")
    console.log(imageData)
    // console.log(요청.body)
  //멀티파트로 폼 데터 전송 ->

  
    db.collection("imageData").insertOne(
        { id : xrlogin_id , imagedata : jsonImageData }

        // function (에러, 결과) {
        // if(에러){
        //   응답.status(200).json({ good: "규민아 있는 아이디란다 .... "});
        // }}

      );

    // db.collection("imageData").

    응답.status(200).json({imageData})                    
    })
