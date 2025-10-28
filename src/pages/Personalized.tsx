import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Leaf, UtensilsCrossed } from 'lucide-react';

// --- DATA FROM PYTHON SCRIPT ---

interface Product {
    name: string;
    cals: number;
    fat: number;
    protein: number;
    carbs: number;
    sugar: number;
    category: string;
    tags: string[];
}

interface UserProfile {
    name: string;
    allergens: string[];
    dietary_goals: string[];
}

interface Recipe {
    name: string;
    ingredients: string[];
    tags: string[];
}

const DB_PRODUCT_NUTRITION: { [id: string]: Product } = {
    'prod_101': { name: 'Spicy Satay Sauce', cals: 180, fat: 15, protein: 5, carbs: 8, sugar: 4, category: 'sauce', tags: ['contains:peanuts', 'gluten-free'] },
    'prod_102': { name: "Sugary-O's Cereal", cals: 400, fat: 5, protein: 4, carbs: 85, sugar: 30, category: 'cereal', tags: ['contains:gluten'] },
    'prod_103': { name: 'Full-Fat Greek Yogurt', cals: 150, fat: 10, protein: 12, carbs: 4, sugar: 4, category: 'dairy', tags: ['dairy'] },
    'prod_104': { name: 'High-Protein Bran Flakes', cals: 350, fat: 3, protein: 15, carbs: 70, sugar: 8, category: 'cereal', tags: ['contains:gluten', 'low-sugar'] },
    'prod_105': { name: '0% Fat Greek Yogurt', cals: 90, fat: 0, protein: 18, carbs: 5, sugar: 5, category: 'dairy', tags: ['dairy', 'low-fat'] },
    'prod_201': { name: 'Chicken Breast (1lb)', cals: 165, fat: 3.6, protein: 31, carbs: 0, sugar: 0, category: 'meat', tags: ['high-protein'] },
    'prod_202': { name: 'Broccoli Florets', cals: 55, fat: 0.6, protein: 3.7, carbs: 11, sugar: 1.7, category: 'produce', tags: ['vegan', 'low-carb'] },
};

const DB_USER_PROFILES: { [id: string]: UserProfile } = {
    'user_A': { name: 'Alice', allergens: ['peanuts'], dietary_goals: ['low-sugar', 'low-fat'] },
    'user_B': { name: 'Bob', allergens: ['dairy'], dietary_goals: ['high-protein', 'low-carb'] },
};

const DB_RECIPES: { [id: string]: Recipe } = {
    'recipe_001': { name: 'Healthy Grilled Chicken & Broccoli', ingredients: ['prod_201', 'prod_202'], tags: ['low-carb', 'high-protein', 'low-fat'] },
    'recipe_002': { name: 'Yogurt Parfait', ingredients: ['prod_103', 'prod_202'], tags: ['low-carb'] },
    'recipe_003': { name: 'Protein Cereal Bowl', ingredients: ['prod_104', 'prod_105'], tags: ['low-fat', 'high-protein', 'low-sugar'] },
};

const Personalized = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    
    // For this prototype, we'll cycle between the two mock users.
    // In a real app, `user.id` would be used directly.
    const mockUserId = 'user_A'; // or 'user_B'
    const userProfile = DB_USER_PROFILES[mockUserId];

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth');
        }
    }, [user, loading, navigate]);

    const getRecommendedProducts = () => {
        if (!userProfile) return [];
        return Object.entries(DB_PRODUCT_NUTRITION).filter(([_, product]) => {
            const hasAllergen = product.tags.some(tag => userProfile.allergens.some(a => tag.includes(a)));
            if (hasAllergen) return false;

            const meetsGoals = product.tags.some(tag => userProfile.dietary_goals.includes(tag));
            return meetsGoals;
        });
    };

    const getRecommendedRecipes = () => {
        if (!userProfile) return [];

        return Object.entries(DB_RECIPES).filter(([_, recipe]) => {
            const hasAllergen = recipe.ingredients.some(ingId => 
                DB_PRODUCT_NUTRITION[ingId].tags.some(tag => 
                    userProfile.allergens.some(a => tag.includes(a))
                )
            );
            if (hasAllergen) return false;

            const meetsGoals = recipe.tags.some(tag => userProfile.dietary_goals.includes(tag));
            return meetsGoals;
        });
    };
    
    const recommendedProducts = getRecommendedProducts();
    const recommendedRecipes = getRecommendedRecipes();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <main className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold mb-2">Your Personalized Hub</h1>
                <p className="text-muted-foreground mb-6">Recommendations based on your goals and preferences.</p>

                 <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                         <CardDescription>
                           These settings are used to tailor your recommendations.
                         </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Your Dietary Goals</h3>
                            <div className="flex gap-2">
                                {userProfile.dietary_goals.map(goal => <Badge key={goal} variant="outline">{goal}</Badge>)}    
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Your Allergens</h3>
                            <div className="flex gap-2">
                                {userProfile.allergens.map(allergen => <Badge key={allergen} variant="destructive">{allergen}</Badge>)}    
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
                        <div className="space-y-4">
                            {recommendedProducts.map(([id, product]) => (
                                <Card key={id}>
                                    <CardHeader>
                                        <CardTitle>{product.name}</CardTitle>
                                        <CardDescription>{product.category}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-between items-center">
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Flame className="w-4 h-4"/> {product.cals} cals</span>
                                            <span className="flex items-center gap-1"><Leaf className="w-4 h-4"/> {product.protein}g protein</span>
                                        </div>
                                        <Button>Add to Cart</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Recommended Recipes</h2>
                        <div className="space-y-4">
                             {recommendedRecipes.map(([id, recipe]) => (
                                <Card key={id}>
                                    <CardHeader>
                                        <CardTitle>{recipe.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm font-medium mb-2">Ingredients:</p>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                                            {recipe.ingredients.map(ingId => <li key={ingId}>{DB_PRODUCT_NUTRITION[ingId].name}</li>)}
                                        </ul>
                                        <div className="flex gap-2">
                                            {recipe.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Personalized;
