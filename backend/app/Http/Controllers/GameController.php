<?php
// backend/app/Http/Controllers/GameController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GameController extends Controller
{
    public function showHauntedHouse()
    {
        return view('games.hauntedhouse');
    }

    // Add other game methods here
}