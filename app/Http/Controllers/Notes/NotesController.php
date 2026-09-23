<?php

namespace App\Http\Controllers\Notes;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\T_Sales;
use App\Repositories\Notes\NotesRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotesController extends Controller
{
    protected $NotesRepository;

    public function __construct(NotesRepository $NotesRepository)
    {
        $this->NotesRepository = $NotesRepository;
    }
    public function index()
    {
        $data = $this->NotesRepository->getAll();

        return Inertia::render("notes/Index", [
            "sales" => $data["sales"],
            "product" => $data["product"]
        ]);
    }
}
