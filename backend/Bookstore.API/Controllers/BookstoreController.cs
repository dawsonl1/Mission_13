using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bookstore.API.Models;

namespace Bookstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookstoreController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BookstoreController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet("/api/health")]
    public IActionResult Health() => Ok(new { Status = "Healthy" });

    [HttpGet("books")]
    public async Task<IActionResult> GetBooks(
        int pageNum = 1,
        int pageSize = 5,
        string? category = null,
        string sortBy = "title")
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        query = sortBy.ToLower() switch
        {
            "title" => query.OrderBy(b => b.Title),
            "author" => query.OrderBy(b => b.Author),
            "price" => query.OrderBy(b => b.Price),
            _ => query.OrderBy(b => b.Title)
        };

        var totalCount = await query.CountAsync();
        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { Books = books, TotalCount = totalCount });
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("books/{id}")]
    public async Task<IActionResult> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        return Ok(book);
    }

    [HttpPost("books")]
    public async Task<IActionResult> CreateBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
    }

    [HttpPut("books/{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
    {
        if (id != book.BookId) return BadRequest();

        _context.Entry(book).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("books/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
