import Image from "next/image";

export default function About() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 font-sans text-center ">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <Image
            src="/about.png"
            alt="Logo da Família Auditore"
            width={420}
            height={420}
            className="w-48 md:w-64 h-auto mx-auto rounded-full shadow-lg"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Auditore Family
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-justify">
          A Auditore foi fundada em 12 de maio de 2020. Eu, AizeN, sempre tive o
          desejo de criar um grupo, mas esperava o momento certo para torná-lo
          realidade. O sobrenome "Auditore" foi inspirado no jogo Assassin's
          Creed; achei muito foda e decidi batizar o grupo com esse nome.
          <br />
          <br />
          Desde o início, sempre tive uma visão muito clara do que queria para a
          Auditore. Meu objetivo era criar um grupo diferente dos demais da
          época: algo mais organizado e com uma abordagem diferente. Observava
          as famílias da época com 4 fundadores, 5 donos, 3 subdonos e pensava:
          "Isso não faz nenhum sentido. É muita bagunça." Muitas vezes, criavam
          uma família, mas, em vez de valorizarem sua própria, acabavam
          bajulando caras de outras famílias e se tornavam apenas coadjuvantes,
          sem relevância. Com a Auditore, quis fazer diferente. Sim, somos -
          diferentões. A Auditore foi criada para ser independente e não apenas
          mais uma.
        </p>
      </div>
    </main>
  );
}
