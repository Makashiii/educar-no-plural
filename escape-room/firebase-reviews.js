(function(){
 let app=null,auth=null,db=null,ready=false;
 try{if(window.firebase && window.ESCAPE_FIREBASE_CONFIG?.projectId){app=firebase.initializeApp(window.ESCAPE_FIREBASE_CONFIG);auth=firebase.auth();db=firebase.firestore();ready=true}}catch(e){ready=false}
 async function submitReview(answer){
  if(!ready)throw new Error('Firebase não configurado');
  if(!auth.currentUser)await auth.signInAnonymously();
  const payload={clima:answer.clima,matematica:answer.matematica,engajamento:answer.engajamento,level:answer.level,createdAt:firebase.firestore.FieldValue.serverTimestamp()};
  await db.collection('avaliacoes').add(payload);
 }
 async function listReviews(){
  if(!ready||!auth.currentUser||auth.currentUser.uid!==window.ESCAPE_TEACHER_UID)throw new Error('Acesso não autorizado');
  const snapshot=await db.collection('avaliacoes').orderBy('createdAt','desc').limit(2000).get();return snapshot.docs.map(d=>d.data());
 }
 async function login(email,password){
  if(!ready)throw new Error('Firebase não configurado');
  const result=await auth.signInWithEmailAndPassword(email,password);
  if(result.user.uid!==window.ESCAPE_TEACHER_UID){await auth.signOut();throw new Error('Conta não autorizada')}
  return listReviews();
 }
 window.EscapeReviewBackend={isReady:()=>ready,submitReview,listReviews,login,logout:()=>ready?auth.signOut():Promise.resolve()};
})();
