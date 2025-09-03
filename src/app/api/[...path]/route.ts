import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api', ''); 
  const url = `${API_URL}${path}${req.nextUrl.search}`;

  if (!API_URL) {
    return NextResponse.json(
      { error: 'A URL da API não está configurada no servidor.' },
      { status: 500 }
    );
  }

  const headers = new Headers(req.headers);
  headers.delete('host');

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: headers, 
      body: req.body,
      duplex: 'half',
    });

    const responseHeaders = new Headers(response.headers);
    const setCookie = response.headers.get('Set-Cookie');

    if (setCookie) {
      responseHeaders.set('Set-Cookie', setCookie);
    }
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error: unknown) {
    console.error(`Erro ao conectar com a API:`, error); 
    return NextResponse.json(
      { error: 'Erro de conexão com o serviço de autenticação.' },
      { status: 503 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };