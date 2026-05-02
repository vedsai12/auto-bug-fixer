import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Language, AnalysisScore } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const LANGUAGE_OPTIONS: { value: Language; label: string; monacoLang: string }[] = [
  { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
  { value: 'typescript', label: 'TypeScript', monacoLang: 'typescript' },
  { value: 'python', label: 'Python', monacoLang: 'python' },
  { value: 'java', label: 'Java', monacoLang: 'java' },
  { value: 'go', label: 'Go', monacoLang: 'go' },
  { value: 'rust', label: 'Rust', monacoLang: 'rust' },
  { value: 'cpp', label: 'C++', monacoLang: 'cpp' },
]

export const SAMPLE_CODES: Record<Language, string> = {
  javascript: `// Sample JavaScript with bugs - try analyzing this!
function fetchUserData(userId) {
  var data = null;
  
  fetch('/api/users/' + userId)
    .then(function(response) {
      data = response.json(); // Missing await
    })
    .catch(function(err) {
      // Empty catch block - swallowing errors
    });
  
  return data; // Will always return null
}

function processItems(items) {
  for (var i = 0; i <= items.length; i++) { // Off-by-one error
    console.log(items[i].name); // Potential null reference
  }
}

// Memory leak - event listener never removed
function setupHandler() {
  document.addEventListener('click', function() {
    heavyOperation();
  });
}

function heavyOperation() {
  var result = [];
  for (var i = 0; i < 10000; i++) {
    result.push(new Array(1000).fill(Math.random()));
  }
  return result;
}`,

  typescript: `// TypeScript with type issues
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: any): Promise<any> {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user;
}

function updateUserAge(user: User, age: string) {
  // Type mismatch - age should be number
  return { ...user, age: age };
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User) {
    this.users.push(user);
    this.users.push(user); // Duplicate push
  }
  
  findUser(id: number): User {
    // Can return undefined but typed as User
    return this.users.find(u => u.id === id)!;
  }
}`,

  python: `# Python code with multiple issues
import os
import pickle

def load_user_data(filename):
    # Security: unsafe deserialization
    with open(filename, 'rb') as f:
        return pickle.load(f)

def calculate_average(numbers):
    total = 0
    for num in numbers:
        total = total + num
    # ZeroDivisionError if empty list
    return total / len(numbers)

def read_config(path):
    # File handle never closed
    f = open(path, 'r')
    config = f.read()
    return config

class DatabaseConnection:
    def __init__(self):
        self.connection = None
    
    def query(self, sql, params):
        # SQL injection vulnerability
        cursor = self.connection.cursor()
        cursor.execute(f"SELECT * FROM users WHERE id = {params}")
        return cursor.fetchall()
    
    def get_password(self, user_id):
        # Storing/returning plaintext password
        result = self.query("", user_id)
        return result[0]['password']`,

  java: `// Java code with common issues
import java.util.*;
import java.io.*;

public class UserManager {
    private static UserManager instance;
    private List<String> users = new ArrayList<>();
    
    // Not thread-safe singleton
    public static UserManager getInstance() {
        if (instance == null) {
            instance = new UserManager();
        }
        return instance;
    }
    
    public void addUser(String user) {
        // NullPointerException risk
        users.add(user.toLowerCase());
    }
    
    public String getUser(int index) {
        // No bounds checking
        return users.get(index);
    }
    
    public void processFile(String path) {
        try {
            FileReader fr = new FileReader(path);
            // Resource leak - stream never closed
            BufferedReader br = new BufferedReader(fr);
            String line = br.readLine();
            System.out.println(line);
        } catch (IOException e) {
            // Exception swallowed
        }
    }
}`,

  go: `// Go code with issues
package main

import (
    "fmt"
    "sync"
)

var counter int // Race condition potential
var wg sync.WaitGroup

func increment() {
    defer wg.Done()
    // Missing mutex - data race
    counter++
}

func divideNumbers(a, b int) int {
    // No division by zero check
    return a / b
}

func readFromChannel(ch chan int) {
    // Potential deadlock - no timeout
    val := <-ch
    fmt.Println(val)
}

func main() {
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go increment()
    }
    wg.Wait()
    fmt.Println(counter)
    
    // Ignoring error return
    result := divideNumbers(10, 0)
    fmt.Println(result)
}`,

  rust: `// Rust code with issues
use std::collections::HashMap;

fn get_value(map: &HashMap<String, i32>, key: &str) -> i32 {
    // Panics if key doesn't exist
    *map.get(key).unwrap()
}

fn process_vector(data: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    for i in 0..data.len() + 1 { // Off-by-one, potential panic
        result.push(data[i] * 2);
    }
    result
}

fn string_operation(s: String) -> String {
    let _owned = s; // s moved here
    // s is no longer valid
    String::from("processed")
}

struct Config {
    debug: bool,
    max_retries: i32,
}

fn load_config() -> Config {
    // Hardcoded values, no error handling
    Config {
        debug: true,
        max_retries: -1, // Negative retry count
    }
}`,

  cpp: `// C++ code with memory issues
#include <iostream>
#include <string>

class Buffer {
    char* data;
    int size;
public:
    Buffer(int s) {
        size = s;
        data = new char[s]; // No null check
    }
    
    // Missing copy constructor and assignment operator
    // Violates Rule of Three
    
    ~Buffer() {
        delete data; // Should be delete[]
    }
    
    void write(const char* input, int len) {
        // Buffer overflow - no bounds checking
        for (int i = 0; i < len; i++) {
            data[i] = input[i];
        }
    }
};

int* dangerousFunction() {
    int localVar = 42;
    return &localVar; // Returning pointer to local variable
}

int main() {
    int* ptr = new int(5);
    // Memory leak - ptr never deleted
    
    int arr[5] = {1, 2, 3, 4, 5};
    std::cout << arr[10] << std::endl; // Out-of-bounds access
    
    return 0;
}`,
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  if (score >= 40) return 'Poor'
  return 'Critical'
}

export function calculateOverallScore(score: AnalysisScore): number {
  return Math.round(
    (score.performance + score.readability + score.security + score.maintainability) / 4
  )
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadCode(code: string, language: string, filename?: string): void {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    go: 'go',
    rust: 'rs',
    cpp: 'cpp',
  }
  const ext = extensions[language] || 'txt'
  const name = filename || `fixed_code.${ext}`
  const blob = new Blob([code], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatTimestamp(date: Date): string {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((date.getTime() - Date.now()) / 60000),
    'minute'
  )
}

export const LOADING_STEPS = [
  { step: 'scanning', label: 'Scanning code structure...', icon: '🔍' },
  { step: 'detecting', label: 'Detecting bugs & vulnerabilities...', icon: '🐛' },
  { step: 'fixing', label: 'Applying intelligent fixes...', icon: '🔧' },
  { step: 'optimizing', label: 'Optimizing for performance...', icon: '⚡' },
]
