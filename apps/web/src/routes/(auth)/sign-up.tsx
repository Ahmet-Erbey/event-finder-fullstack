import { createFileRoute, Link } from '@tanstack/react-router';
import { SignUpForm } from '#/components/form/sign-up-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
});

function SignUp() {
  return (
    <Card className="gap-4 border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">Hesap Oluştur</CardTitle>
        <CardDescription>
          Event Finder'a katılmak için bilgilerini gir. <br />
          Zaten hesabın var mı?{' '}
          <Link to="/sign-in" className="hover:text-primary underline underline-offset-4">
            Giriş Yap
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground px-4 text-center text-sm">
          Kaydol butonuna basarak{' '}
          <a href="/terms" className="hover:text-primary underline underline-offset-4">
            Kullanım Şartları
          </a>{' '}
          ve{' '}
          <a href="/privacy" className="hover:text-primary underline underline-offset-4">
            Gizlilik Politikası
          </a>
          'nı kabul etmiş olursun.
        </p>
      </CardFooter>
    </Card>
  );
}
