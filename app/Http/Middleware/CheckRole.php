<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // return dd($roles . 'asdasda' . $request->user()->roles);
        // Contoh logika sederhana: cek apakah user punya role yang sesuai
        if (! $request->user() || $request->user()->roles->name !== $roles) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }    
        
        return $next($request);
    }
}
