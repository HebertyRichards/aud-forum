export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 font-sans text-center text-white">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-white animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 rounded-full bg-white animate-pulse [animation-delay:0.4s]"></div>
      </div>
      <p className="mt-4 text-lg">Carregando informações...</p>
    </main>
  );
}
