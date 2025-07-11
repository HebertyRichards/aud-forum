import Link from "next/link";
export default function NotFound() {
  return (
    <>
      <h1>Erro 404</h1>
      <p>
        Página não encontrada, clique no b~toa abaixo para voltar na página
        inicial
      </p>
      <Link href="/">Início</Link>
    </>
  );
}
