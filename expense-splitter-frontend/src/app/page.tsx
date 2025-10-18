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
              Split expenses with friends and groups easily. Keep track of who owes what.
            </p>
          </div>

          <div className="flex gap-4">
            <Button size="lg">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
            <Card>
              <CardHeader>
                <CardTitle>Create Groups</CardTitle>
                <CardDescription>
                  Organize expenses with friends, roommates, or travel groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create unlimited groups and invite members to track shared expenses together.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Expenses</CardTitle>
                <CardDescription>
                  Add expenses and see who paid for what
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Easily log expenses with descriptions, amounts, and who paid for each item.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settle Up</CardTitle>
                <CardDescription>
                  Calculate who owes whom automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get instant calculations of balances and settle debts with minimal transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
