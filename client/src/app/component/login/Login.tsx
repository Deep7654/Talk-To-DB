export default function ConnectNeon(){
  const connect=()=>{
    window.location.href=`${process.env.NEXT_PUBLIC_API_URL}/auth/neon`;
  };

  return(
    <button onClick={connect}>
      Connect Neon
    </button>
  );
}
