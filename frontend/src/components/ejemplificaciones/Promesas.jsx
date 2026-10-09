import { useState } from "react";

export default function Promesas() {
  const [n, setN] = useState(0);

  async function probar() {
      setN((v) => v + 1)
      await new Promise((ok) => setTimeout(ok, 300));
      console.log("la variable n vale:", n);
  }

  return <button onClick={probar}>n = {n}</button>;
}