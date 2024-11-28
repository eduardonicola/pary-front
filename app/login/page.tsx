'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import Link from 'next/link';
import axiosInstance from '../../hooks/axios/services';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email,
      password
    }
    try {
      const response = await axiosInstance.post('/auth/login', data)
      if (response.data.access_token) {
        storage.setAuth( response.data.access_token);
        storage.setUser(response.data)
        toast.success('login realizado')
        router.push('/dashboard');
      }
    } catch (error: any) {
      if(error?.response?.data?.message[0]){
        toast.error(error.response.data.message[0])
      }
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}