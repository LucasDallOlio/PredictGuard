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
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm = () => {
  return (
    <section
      className="bg-primary dark:bg-background min-h-screen flex items-center justify-center relative">
      <div
        className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        {/* Outer big circle */}
        <div
          className="absolute left-1/1 top-0 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Inner circle */}
        <div
          className="absolute left-1/1 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary dark:bg-background" />
      </div>
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <a href="">
                <img
                  src="img/icone.png"
                  alt="shadcnspace"
                  className="dark:hidden h-20 w-20" />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Bem-vindo ao <span className="font-bold=">Predict<span className="text-ring">Guard</span></span>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Faça login na sua conta agora
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form>
              <FieldGroup className="gap-6">
                <div className="flex flex-col gap-4">
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="email" className="text-sm text-muted-foreground font-normal">
                      Email corporativo
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@predictguard.com"
                      required
                      className="dark:bg-background" />
                  </Field>
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="password" className="text-sm text-muted-foreground font-normal">
                      Senha
                    </FieldLabel>

                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      required
                      className="dark:bg-background" />
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
                  <Button type="submit" size={"lg"} className="rounded-lg">
                    Entrar
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
