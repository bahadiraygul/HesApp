import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Expense Splitter
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Masrafları arkadaşlarınız ve gruplarınızla kolayca paylaşın. Kim kime ne borçlu takip edin.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg">
                Başlayın
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Giriş Yap
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
            <Card>
              <CardHeader>
                <CardTitle>Grup Oluştur</CardTitle>
                <CardDescription>
                  Arkadaşlarınız, ev arkadaşlarınız veya seyahat gruplarınızla masrafları organize edin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sınırsız grup oluşturun ve ortak masrafları birlikte takip etmek için üyeleri davet edin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Masraf Takibi</CardTitle>
                <CardDescription>
                  Masrafları ekleyin ve kimin ne ödediğini görün
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Açıklama, tutar ve kimin ödediği bilgileriyle masrafları kolayca kaydedin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hesaplaşma</CardTitle>
                <CardDescription>
                  Kim kime ne kadar borçlu otomatik hesaplayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bakiyelerin anında hesaplanmasını sağlayın ve minimum işlemle borçları kapatın.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
