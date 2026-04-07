"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  if (!email || !senha) {
    return Swal.fire({
      icon: "warning",
      title: "Campos obrigatórios",
      text: "Preencha todos os campos!",
    });
  }

  try {
    setCarregando(true);

    await login(email, senha);

    await Swal.fire({
      icon: "success",
      title: "Login realizado!",
      text: "Bem-vindo ao sistema 🚀",
      timer: 2000,
      showConfirmButton: false,
    });

   

  } catch (erro) {
    Swal.fire({
      icon: "error",
      title: "Erro no login",
      text: erro.message,
    });
  } finally {
    setCarregando(false);
  }
}

  return (
    <section className="bg-primary dark:bg-background min-h-screen flex items-center justify-center relative">
      
      <div className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        <div className="absolute left-1/1 top-0 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        <div className="absolute left-1/1 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary dark:bg-background" />
      </div>

      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative">
          
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <img
                src="img/icone.png"
                alt="logo"
                className="dark:hidden h-20 w-20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Bem-vindo ao{" "}
                <span className="font-bold">
                  Predict<span className="text-ring">Guard</span>
                </span>
              </CardTitle>

              <CardDescription className="text-sm text-muted-foreground font-normal">
                Faça login na sua conta agora
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} autoComplete="off">
              
              <FieldGroup className="gap-6">
                
                <div className="flex flex-col gap-4">
                  
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="email" className="text-sm text-muted-foreground font-normal">
                      Email corporativo
                    </FieldLabel>

                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="new-email"
                      placeholder="example@predictguard.com"
                      required
                      className="dark:bg-background"
                    />
                  </Field>

                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="password" className="text-sm text-muted-foreground font-normal">
                      Senha
                    </FieldLabel>

                    <Input
                      id="password"
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Digite sua senha"
                      required
                      className="dark:bg-background"
                    />
                  </Field>

                </div>

                <Field orientation="horizontal" className="justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" defaultChecked className="cursor-pointer" />
                    <FieldLabel
                      htmlFor="terms"
                      className="text-sm text-primary font-normal cursor-pointer">
                      Lembre-se deste dispositivo
                    </FieldLabel>
                  </div>

                  <a href="#" className="text-sm text-card-foreground font-medium text-end">
                    Esqueceu a senha?
                  </a>
                </Field>

                <Field className="gap-4">
                  <Button
                    type="submit"
                    size={"lg"}
                    className="rounded-lg"
                    disabled={carregando}
                  >
                    {carregando ? "Entrando..." : "Entrar"}
                  </Button>
                </Field>

              </FieldGroup>

            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LoginForm;