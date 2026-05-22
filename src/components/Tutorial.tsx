/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code, BookOpen, ChevronRight, CheckCircle2, Play, Sparkles, 
  HelpCircle, Trophy, Award, Terminal, ArrowRight, ArrowLeft 
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  explanation: string;
  example: string;
  exercise: string;
  starterCode: string;
  solutionKeyword: string;
  validationFn: (code: string) => { success: boolean; message: string; output?: string };
}

const LAN_TUTORIALS: Record<string, Lesson[]> = {
  'JavaScript/TypeScript': [
    {
      id: 1,
      title: "Biến & Kiểu Dữ Liệu (Variables & Types)",
      description: "Học cách khai báo biến để lưu trữ chuỗi, số và giá trị boolean.",
      explanation: "Trong JavaScript/TypeScript, biến dùng để lưu dữ liệu. Bạn dùng `let` cho biến có thể thay đổi giá trị và `const` cho hằng số (không thể thay đổi).\nCác kiểu dữ liệu cơ bản:\n- `String`: Chuỗi chữ đặt trong dấu ngoặc kép (ví dụ: `\"Hello\"`)\n- `Number`: Số nguyên hoặc số thập phân (ví dụ: `42`, `3.14`)\n- `Boolean`: Chỉ có 2 giá trị là `true` (đúng) hoặc `false` (sai).",
      example: "let user = \"Nam\";\nconst age = 18;\nlet isStudent = true;",
      exercise: "Hãy hoàn thiện hàm `getWelcomeMessage(name)` để khai báo hằng số `greeting` lưu trữ chuỗi `\"Xin chào \"` và trả về thông tin kết hợp giữa `greeting` và tham số `name` nhận vào. \nVí dụ: `getWelcomeMessage(\"Minh\")` sẽ trả về `\"Xin chào Minh\"`.",
      starterCode: "function getWelcomeMessage(name: string): string {\n    // Khai báo hằng số greeting có giá trị \"Xin chào \"\n    const greeting = \"Xin chào \";\n    \n    // Trả về chuỗi kết hợp giữa greeting và name ở dưới:\n    return \n}",
      solutionKeyword: "greeting",
      validationFn: (code: string) => {
        try {
          // Setup custom test function
          const testFnBody = code.replace(/function\s+getWelcomeMessage\s*\(\s*name\s*(:\s*string)?\s*\)\s*(:\s*string)?/g, 'return function(name)');
          const evaluation = new Function(`
            ${testFnBody}
            return getWelcomeMessage;
          `)();
          
          if (typeof evaluation !== 'function') {
            return { success: false, message: "Cú pháp lỗi: Không định vị được hàm getWelcomeMessage. Hãy kiểm tra lại." };
          }
          
          const out1 = evaluation("Minh");
          const out2 = evaluation("Bích");
          if (out1 === "Xin chào Minh" && out2 === "Xin chào Bích") {
            return { success: true, message: "Xuất sắc! Biến và chuỗi đã được ghép chính xác hoàn hảo.", output: out1 };
          } else {
            return { success: false, message: `Kết quả chưa đúng: getWelcomeMessage("Minh") trả về "${out1}", mong đợi "Xin chào Minh".`, output: out1 };
          }
        } catch (err: any) {
          return { success: false, message: `Lỗi biên dịch JS: ${err.message}` };
        }
      }
    },
    {
      id: 2,
      title: "Câu lệnh rẽ nhánh (If-Else Conditionals)",
      description: "Đưa ra quyết định thông minh trong mã nguồn của bạn dựa trên điều kiện.",
      explanation: "Lệnh `if-else` giúp chương trình quyết định rẽ nhánh logic.\nNếu biểu thức điều kiện trong dấu ngoặc `if (điều_kiện)` trả về `true`, khối lệnh bên trong `{}` sẽ được thực thi. Ngược lại, nếu có phần `else`, khối lệnh của `else` sẽ được chạy.\nCác toán tử so sánh thông dụng:\n- So sánh bằng: `===`\n- Lớn hơn: `>` , Nhỏ hơn: `<`\n- Lớn hơn hoặc bằng: `>=`, Nhỏ hơn hoặc bằng: `<=`\n- Khác: `!==`",
      example: "if (age >= 18) {\n    return \"Đủ tuổi bầu cử\";\n} else {\n    return \"Chưa đủ tuổi\";\n}",
      exercise: "Hãy lập trình hàm `checkPassClass(score)` nhận vào điểm số số nguyên `score`. Nếu điểm lớn hơn hoặc bằng `5`, trả về `\"ĐẠT\"`. Ngược lại (nhỏ hơn 5), trả về `\"TRƯỢT\"`.",
      starterCode: "function checkPassClass(score: number): string {\n    // Lập trình logic điều kiện ở đây\n    if (score >= 5) {\n        return \"ĐẠT\";\n    } else {\n        return \n    }\n}",
      solutionKeyword: "TRƯỢT",
      validationFn: (code: string) => {
        try {
          const testFnBody = code.replace(/function\s+checkPassClass\s*\(\s*score\s*(:\s*number)?\s*\)\s*(:\s*string)?/g, 'return function(score)');
          const evaluation = new Function(`
            ${testFnBody}
            return checkPassClass;
          `)();
          const r1 = evaluation(7);
          const r2 = evaluation(4);
          if (r1 === "ĐẠT" && r2 === "TRƯỢT") {
            return { success: true, message: "Tuyệt vời! Bạn đã thông thạo logic rẽ nhánh If-Else.", output: `Điểm 7 -> ${r1}, Điểm 4 -> ${r2}` };
          } else {
            return { success: false, message: `Logic chưa khớp. Với điểm 4 nhận được "${r2}", mong đợi "TRƯỢT".`, output: `Điểm 7 -> ${r1}, Điểm 4 -> ${r2}` };
          }
        } catch (err: any) {
          return { success: false, message: `Lỗi cú pháp: ${err.message}` };
        }
      }
    },
    {
      id: 3,
      title: "Vòng lặp (Loops & Repetition)",
      description: "Thực thi lặp đi lặp lại một tác vụ tự động nhiều lần.",
      explanation: "Vòng lặp giúp lặp lại một đoạn code mà không cần viết lại nhiều lần.\nVòng lặp `for` cổ điển bao gồm 3 bước:\n`for (khởi_tạo; điều_kiện; bước_nhảy) { ... }`\nVí dụ: `for (let i = 0; i < 5; i++)` sẽ lặp 5 lần với `i` chạy từ 0 đến 4.",
      example: "let tong = 0;\nfor (let i = 1; i <= 10; i++) {\n    tong += i;\n}\n// tong = 55",
      exercise: "Hãy hoàn thành hàm `sumUpTo(n)` để tính tổng các số từ `1` đến `n`. \nVí dụ: `sumUpTo(5)` bằng 1+2+3+4+5 = 15.",
      starterCode: "function sumUpTo(n: number): number {\n    let sum = 0;\n    // Viết vòng lặp để cộng dồn vào biến sum từ 1 đến n\n    for (let i = 1; i <= n; i++) {\n        sum += i;\n    }\n    return sum;\n}",
      solutionKeyword: "sum",
      validationFn: (code: string) => {
        try {
          const testFnBody = code.replace(/function\s+sumUpTo\s*\(\s*n\s*(:\s*number)?\s*\)\s*(:\s*number)?/g, 'return function(n)');
          const evaluation = new Function(`
            ${testFnBody}
            return sumUpTo;
          `)();
          const val5 = evaluation(5);
          const val10 = evaluation(10);
          if (val5 === 15 && val10 === 55) {
            return { success: true, message: "Chúc mừng! Giải trình vòng lặp chạy tính toán siêu tốc hoàn thành.", output: `sumUpTo(5) = ${val5}` };
          } else {
            return { success: false, message: `Kết quả chưa đúng. sumUpTo(5) trả về ${val5}, mong đợi là: 15.`, output: `sumUpTo(5) = ${val5}` };
          }
        } catch (err: any) {
          return { success: false, message: `Lỗi: ${err.message}` };
        }
      }
    },
    {
      id: 4,
      title: "Mảng lưu trữ (Intro to Arrays)",
      description: "Sắp xếp và quản lý danh sách nhiều dữ liệu chung một nơi.",
      explanation: "Mảng (`Array`) là một tập hợp tuần tự các phần tử. Mỗi phần tử có vị trí chỉ mục (`index`) bắt đầu từ **`0`**.\n- Khai báo mảng: `const fruits = [\"Táo\", \"Mận\", \"Lê\"];`\n- Lấy phần tử thứ nhất: `fruits[0]` (bằng `\"Táo\"`)\n- Lấy độ dài mảng: `fruits.length` (tiện cho duyệt vòng lặp)",
      example: "const list = [10, 20, 30];\nconsole.log(list.length); // In ra 3\nconsole.log(list[0]); // In ra 10",
      exercise: "Bồi dưỡng kỹ thuật mảng: Hãy tạo hàm `getFirstAndLast(arr)` nhận vào một mảng chứa bất kỳ phần tử nào, và trả về một mảng mới chỉ gồm phần tử **đầu tiên** và phần tử **cuối cùng** của mảng truyền vào.\nVí dụ: `getFirstAndLast([10, 20, 30, 40])` trả về `[10, 40]`.",
      starterCode: "function getFirstAndLast(arr: any[]): any[] {\n    // Lấy phần tử đầu tiên (index 0) và phần tử cuối (index arr.length - 1)\n    const first = arr[0];\n    const last = arr[arr.length - 1];\n    \n    // Trả về mảng chứa hai phần tử trên\n    return [first, last];\n}",
      solutionKeyword: "arr.length",
      validationFn: (code: string) => {
        try {
          const testFnBody = code.replace(/function\s+getFirstAndLast\s*\(\s*arr\s*(:\s*any\[\])?\s*\)\s*(:\s*any\[\])?/g, 'return function(arr)');
          const evaluation = new Function(`
            ${testFnBody}
            return getFirstAndLast;
          `)();
          const r1 = evaluation([1, 2, 3, 9]);
          const r2 = evaluation(["A", "B", "C"]);
          if (Array.isArray(r1) && r1[0] === 1 && r1[1] === 9 && r2[0] === "A" && r2[1] === "C") {
            return { success: true, message: "Kỹ năng lập trình mảng rất tốt! Bạn đã trích xuất an toàn biên giới mảng.", output: `Kết quả: ${JSON.stringify(r1)}` };
          } else {
            return { success: false, message: `Kết quả mảng không khớp. Nhận được ${JSON.stringify(r1)}, mong đợi: [1, 9].`, output: `Thực tế: ${JSON.stringify(r1)}` };
          }
        } catch (err: any) {
          return { success: false, message: `Lỗi mảng: ${err.message}` };
        }
      }
    },
    {
      id: 5,
      title: "Hàm & Logic tái sử dụng (Functions & Returns)",
      description: "Gom cụm đoạn mã tạo thành một khối chức năng riêng biệt.",
      explanation: "Hàm (`Function`) là một nhóm các khối lệnh thực hiện một chức năng nhất định, có thể nhận các biến số đầu vào (arguments) và trả lại một kết quả (return).\nTừ khóa `return` lập tức dừng luồng thực thi trong hàm và đưa kết quả ra ngoài nơi gọi nó.",
      example: "function doubleNumber(x) {\n    return x * 2;\n}",
      exercise: "Luyện bài thực tiễn: Hãy lập trình hàm `calculateRectangleArea(width, height)` nhận vào chiều rộng và chiều cao, và trả về **Diện tích** của hình chữ nhật đó (`width * height`).",
      starterCode: "function calculateRectangleArea(width: number, height: number): number {\n    // Tính diện tích và trả về kết quả ở dưới đây:\n    return \n}",
      solutionKeyword: "width",
      validationFn: (code: string) => {
        try {
          const testFnBody = code.replace(/function\s+calculateRectangleArea\s*\(\s*width\s*(:\s*number)?\s*,\s*height\s*(:\s*number)?\s*\)\s*(:\s*number)?/g, 'return function(width, height)');
          const evaluation = new Function(`
            ${testFnBody}
            return calculateRectangleArea;
          `)();
          const r1 = evaluation(5, 6);
          const r2 = evaluation(10, 2);
          if (r1 === 30 && r2 === 20) {
            return { success: true, message: "Hoan hô! Bạn đã xuất sắc hoàn thành khóa học nhập môn Lập trình cơ bản!", output: `calculateRectangleArea(5, 6) = ${r1}` };
          } else {
            return { success: false, message: `Chưa khớp đáp án. calculateRectangleArea(5, 6) trả về ${r1}, mong đợi diện tích: 30.`, output: `calculateRectangleArea(5, 6) = ${r1}` };
          }
        } catch (err: any) {
          return { success: false, message: `Lỗi: ${err.message}` };
        }
      }
    }
  ],
  'Python (Offline Concept)': [
    {
      id: 1,
      title: "Khai báo Biến trong Python",
      description: "Làm quen với cách gán biến động và đơn giản của Python.",
      explanation: "Python không cần từ khóa như `let` hay `const`. Bạn khai báo một biến chỉ cần chỉ định tên sản phẩm bằng dấu bằng `=`.\nPython tự động phân giải cấu trúc kiểu của biến một cách thông minh (Dynamic Typing).",
      example: "user_name = \"Thanh\"\nuser_age = 22\nis_active = True",
      exercise: "Xem ví dụ Python: Hãy gõ đoạn code gán biến `x = 10` và `y = 20` rồi gán `tong = x + y`.",
      starterCode: "# Khai báo biến x và y\nx = 10\ny = 20\n\n# Tính tổng\ntong = x + y\nprint(tong)",
      solutionKeyword: "tong",
      validationFn: (code: string) => {
        if (code.includes('tong') && code.includes('=')) {
          return { success: true, message: "Chính xác! Cấu trúc biến Python vô cùng ngắn gọn và trực quan.", output: "tong = 30" };
        }
        return { success: false, message: "Hãy chắc chắn bạn đã khai báo biến `tong = x + y`." };
      }
    },
    {
      id: 2,
      title: "Cấu trúc Thụt lề If-Else của Python",
      description: "Hiểu quy tắc thiết kế mã không dùng ngoặc nhọn của Python.",
      explanation: "Không giống như JS, Python sử dụng dấu hai chấm `:` và **Thụt lề (Indentation)** bằng tab hoặc khoảng trắng để định nghĩa khối mã nằm trong If-Else. Thụt lề là bắt buộc trong Python!",
      example: "if score >= 50:\n    print(\"Duyệt\")\nelse:\n    print(\"Trượt\")",
      exercise: "Mô phỏng: Hãy sửa hàm `is_even(n)` dưới đây để kiểm tra nếu n là số chẵn (`n % 2 == 0`), in ra 'Chan'. Ví dụ minh họa thụt lề thụt lùi hợp lệ.",
      starterCode: "def is_even(n):\n    if n % 2 == 0:\n        return \"Chan\"\n    else:\n        return \"Le\"",
      solutionKeyword: "is_even",
      validationFn: (code: string) => {
        if (code.includes('def') && code.includes('return')) {
          return { success: true, message: "Rất tốt! Bạn đã nắm chắc quy tắc định dạng bằng khối thụt lề của Python.", output: "is_even(4) -> 'Chan'" };
        }
        return { success: false, message: "Vui lòng giữ nguyên cấu trúc Python mẫu cơ bản." };
      }
    }
  ],
  'C++ (Offline Concept)': [
    {
      id: 1,
      title: "Cấu trúc Cơ bản & Khai báo Biến (C++ Basics)",
      description: "Làm quen với mã nguồn C++, hàm main() và quy tắc khai báo biến tĩnh.",
      explanation: "C++ là ngôn ngữ lập trình biên dịch (compiled), hiệu năng cực cao và quản lý bộ nhớ trực tiếp.\nMột chương trình C++ chuẩn luôn bắt đầu bằng `#include` thư viện cần dùng (ví dụ `<iostream>` để vào ra dữ liệu) và hàm khởi chạy chính `int main()`. Thêm vào đó, mọi câu lệnh bắt buộc kết thúc bằng danh sách dấu chấm phẩy `;`.\n\nKhai báo biến trong C++ đòi hỏi chỉ rõ kiểu dữ liệu trước tên biến:\n- `int`: Số nguyên (ví dụ: `int Tuoi = 18;`)\n- `double`: Số thực (ví dụ: `double Gpa = 3.8;`)\n- `std::string`: Chuỗi ký tự (cần `#include <string>`)\n- `bool`: Điều kiện `true`/`false`.",
      example: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string name = \"Bách\";\n    int level = 2;\n    std::cout << name << \" - Cấp độ \" << level << std::endl;\n    return 0;\n}",
      exercise: "Hãy hoàn thành hàm `main` dưới đây bằng cách khai báo thêm một hằng số thực `const double rate = 1.5;` dùng để tính điểm thưởng học tập. Đảm bảo mã của bạn có khai báo `const double rate = 1.5;`",
      starterCode: "#include <iostream>\n\nint main() {\n    // Khai báo hằng số rate có giá trị 1.5 ở đây\n    const double rate = 1.5;\n    \n    std::cout << \"Hệ số điểm thưởng: \" << rate << std::endl;\n    return 0;\n}",
      solutionKeyword: "double rate",
      validationFn: (code: string) => {
        if (code.toLowerCase().includes('double') && (code.includes('rate') || code.includes('1.5'))) {
          return { success: true, message: "Tuyệt đỉnh! Bạn đã khai báo biến tĩnh C++ chính xác tuyệt đối.", output: "Hệ số điểm thưởng: 1.5" };
        }
        return { success: false, message: "Hãy chắc chắn bạn đã khai báo `const double rate = 1.5;` đúng cú pháp C++." };
      }
    },
    {
      id: 2,
      title: "Cấu trúc Điều kiện trong C++",
      description: "Sử dụng câu lệnh rẽ nhánh if-else để duyệt dữ liệu trong C++.",
      explanation: "Cú pháp rẽ nhánh `if-else` của C++ rất giống với JavaScript, sử dụng ngoặc tròn `()` bao quanh điều kiện và ngoặc nhọn `{}` bao quanh thân lệnh thực thi.\nCác toán tử so sánh chuẩn:\n- `==` (so sánh bằng)\n- `!=` (so sánh khác)\n- `>`, `<`, `>=`, `<=` (toán tử so sánh lượng số)",
      example: "int score = 85;\nif (score >= 80) {\n    std::cout << \"Xuat sac\" << std::endl;\n} else {\n    std::cout << \"Kha\" << std::endl;\n}",
      exercise: "Hãy sửa phần khởi tạo giá trị của biến `score` thành `95` hoặc viết điều kiện `if (score >= 90)` để in ra 'XUAT SAC' thay vì mặc định 'DAT' hoặc 'TRUOT'.",
      starterCode: "#include <iostream>\n\nint main() {\n    int score = 95;\n    if (score >= 90) {\n        std::cout << \"XUAT SAC\" << std::endl;\n    } else {\n        std::cout << \"DAT\" << std::endl;\n    }\n    return 0;\n}",
      solutionKeyword: "XUAT SAC",
      validationFn: (code: string) => {
        if (code.includes('XUAT SAC') && code.includes('score')) {
          return { success: true, message: "Đúng rồi! Bạn đã hoàn thành xuất sắc thử thách điều hướng If-Else trên C++.", output: "Output: XUAT SAC" };
        }
        return { success: false, message: "Vui lòng giữ nguyên khối lệnh rẽ nhánh và đảm bảo có chuỗi 'XUAT SAC' được inside logic." };
      }
    }
  ],
  'Java (Offline Concept)': [
    {
      id: 1,
      title: "Khung sườn lớp & Lớp chính trong Java",
      description: "Làm chủ bộ khung hướng đối tượng đặc trưng và cách in ra màn hình của Java.",
      explanation: "Java là ngôn ngữ lập trình thuần hướng đối tượng (OOP). Mọi dòng lệnh Java đều phải trú ngụ bên trong một Lớp (Class).\n\nĐiểm bắt đầu của mọi phần mềm Java là phương thức static khởi chạy chính: `public static void main(String[] args)`.\nĐể in dữ liệu ra luồng đầu ra tiêu chuẩn, Java sử dụng lệnh: `System.out.println(\"Nội dung\")`.\nCác kiểu dữ liệu chính:\n- `String` (chuỗi văn bản, lưu ý viết hoa chữ S)\n- `int` (số nguyên)\n- `double` (số thực)\n- `boolean` (giá trị logic `true`/`false`)",
      example: "public class Main {\n    public static void main(String[] args) {\n        String level = \"Junior\";\n        int exp = 1;\n        System.out.println(level + \" - Exp: \" + exp);\n    }\n}",
      exercise: "Hãy khai báo một biến số nguyên `int solved = 50;` bên trong phương thức `main` đại diện cho số bài LeetCode bạn đã giải. Đảm bảo mã của bạn có khai báo `int solved = 50;`",
      starterCode: "public class Main {\n    public static void main(String[] args) {\n        // Hãy khai báo biến int solved = 50 dưới đây:\n        int solved = 50;\n        \n        System.out.println(\"Bạn đã giải: \" + solved + \" bài toán!\");\n    }\n}",
      solutionKeyword: "int solved",
      validationFn: (code: string) => {
        if (code.includes('int') && code.toLowerCase().includes('solved') && code.includes('50')) {
          return { success: true, message: "Quá hay! Bộ khung lớp OOP của Java đã được bạn khai báo biến tuyệt vời.", output: "Bạn đã giải: 50 bài toán!" };
        }
        return { success: false, message: "Hãy chắc chắn bạn đã khai báo `int solved = 50;` hoàn chỉnh trong hàm main." };
      }
    },
    {
      id: 2,
      title: "Vòng lặp For trong Java",
      description: "Vận dụng vòng lặp đếm phần tử quen thuộc trong Java để tích lũy dữ liệu.",
      explanation: "Vòng lặp `for` trong Java hoạt động tương tự C++ và JavaScript, giúp bạn lặp qua một phạm vi số xác định.\nCú pháp:\n`for (int i = 0; i < n; i++) { ... }`\n\nBạn định nghĩa biến lặp `int i` ngay trong biểu thức khai báo lặp, giúp tối ưu luồng lưu trữ hoạt động.",
      example: "for (int i = 1; i <= 3; i++) {\n    System.out.println(\"Lượt lặp thứ \" + i);\n}",
      exercise: "Hãy hoàn thiện mã nguồn Java dưới đây, thiết lập giới hạn vòng lặp đạt `i < 5` để in ra đầy đủ 5 dòng log rèn luyện.",
      starterCode: "public class Main {\n    public static void main(String[] args) {\n        // Sửa vòng lặp từ i < 3 thành i < 5 để tăng số vòng lặp\n        for (int i = 0; i < 5; i++) {\n            System.out.println(\"Học lập trình Java ngày \" + (i + 1));\n        }\n    }\n}",
      solutionKeyword: "i < 5",
      validationFn: (code: string) => {
        if (code.includes('i < 5') || code.includes('i <= 4')) {
          return { success: true, message: "Rực rỡ! Vòng lặp Java đã in ra đủ 5 dòng huấn luyện thành công mĩ mãn.", output: "Học lập trình Java ngày 1\nHọc lập trình Java ngày 2\nHọc lập trình Java ngày 3\nHọc lập trình Java ngày 4\nHọc lập trình Java ngày 5" };
        }
        return { success: false, message: "Vui lòng sửa điều kiện lặp thành `i < 5` để đạt điều chuẩn 5 lượt in." };
      }
    }
  ]
};

export default function Tutorial() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JavaScript/TypeScript');
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>('');
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({}); // Record of language -> lesson ids[]
  
  // Terminal status
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'success' | 'failed';
    message: string;
    output?: string;
  }>({
    status: 'idle',
    message: "Hệ thống biên dịch đã sẵn sẵng. Lập trình lời giải và ấn 'Chạy thử kiểm thử' để đối chiếu."
  });

  const currentLessons = LAN_TUTORIALS[selectedLanguage] || LAN_TUTORIALS['JavaScript/TypeScript'];
  const activeLesson = currentLessons[activeLessonIdx] || currentLessons[0];

  // Reset editor text when switching lesson or language
  React.useEffect(() => {
    setUserCode(activeLesson.starterCode);
    setValidationResult({
      status: 'idle',
      message: "Hệ thống biên dịch đã sẵn sẵng. Lập trình lời giải và ấn 'Chạy thử kiểm thử' để đối chiếu."
    });
  }, [activeLessonIdx, selectedLanguage]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setActiveLessonIdx(0);
  };

  const handleRunVerify = () => {
    const res = activeLesson.validationFn(userCode);
    if (res.success) {
      setValidationResult({
        status: 'success',
        message: res.message,
        output: res.output
      });
      
      // Save progress to state
      const currentLangCompletes = completedLessons[selectedLanguage] || [];
      if (!currentLangCompletes.includes(activeLesson.id)) {
        const nextCompletes = {
          ...completedLessons,
          [selectedLanguage]: [...currentLangCompletes, activeLesson.id]
        };
        setCompletedLessons(nextCompletes);
      }
    } else {
      setValidationResult({
        status: 'failed',
        message: res.message,
        output: res.output
      });
    }
  };

  const nextLesson = () => {
    if (activeLessonIdx < currentLessons.length - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
    }
  };

  const prevLesson = () => {
    if (activeLessonIdx > 0) {
      setActiveLessonIdx(activeLessonIdx - 1);
    }
  };

  const doneCount = completedLessons[selectedLanguage]?.length || 0;
  const progressPercent = Math.round((doneCount / currentLessons.length) * 100);

  return (
    <div className="space-y-6" id="learning-tutorial-hub">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-brand-panel border border-brand-border p-6 shadow-[4px_4px_0_#000000] gap-4">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
            <BookOpen className="w-5 h-5 text-brand-neon" />
            Nhập Môn Lập Trình Cho Người Mới // Coding Bootcamp
          </h2>
          <p className="text-[11px] text-zinc-500 font-mono uppercase mt-1 leading-relaxed">
            // Khóa học tinh lọc thực tế giúp học sinh/sinh viên mới bắt kịp tư duy gán biến, điều hướng, vòng lặp trước khi giải quyết LeetCode.
          </p>
        </div>

        {/* Language selector buttons */}
        <div className="flex gap-2 shrink-0 select-none">
          {Object.keys(LAN_TUTORIALS).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-2 border font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-brand-neon border-brand-neon text-black font-black'
                  : 'border-brand-border text-zinc-400 hover:text-white bg-brand-dark'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main Study Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPARTMENT: Lesson outline, descriptions, examples */}
        <div className="lg:col-span-5 bg-brand-panel border border-brand-border flex flex-col justify-between h-[620px] shadow-[4px_4px_0_#000000] overflow-hidden">
          
          {/* Header Progress */}
          <div className="p-4 border-b border-brand-border bg-brand-dark shrink-0 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
              Bài học {activeLessonIdx + 1} của {currentLessons.length}
            </span>
            
            <div className="flex items-center gap-2 select-none">
              <span className="text-[9.5px] font-mono font-bold text-brand-neon">{progressPercent}% HOÀN THÀNH</span>
              <div className="w-20 bg-zinc-800 h-1.5 border border-brand-border rounded-none overflow-hidden">
                <div 
                  className="bg-brand-neon h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Core Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Subject Title */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-[#111] border border-brand-border p-1 text-zinc-500 font-mono font-black uppercase">
                  LESSON 0{activeLesson.id}
                </span>
                {completedLessons[selectedLanguage]?.includes(activeLesson.id) && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/25 px-1.5 py-0.5 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ĐÃ HOÀN THÀNH
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-white uppercase italic tracking-tight mt-2.5">
                {activeLesson.title}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-1 leading-relaxed">
                {activeLesson.description}
              </p>
            </div>

            {/* In-depth Theory */}
            <div className="bg-brand-dark/95 border border-brand-border p-4 space-y-3">
              <h4 className="text-[10.5px] font-extrabold uppercase text-brand-neon font-mono tracking-widest">// 1. LÝ THUYẾT NỀN TẢNG</h4>
              <div className="text-xs text-zinc-350 whitespace-pre-wrap leading-relaxed font-mono">
                {activeLesson.explanation}
              </div>
            </div>

            {/* Code Syntax Visualizer */}
            <div className="space-y-2">
              <h4 className="text-[10.5px] font-extrabold uppercase text-zinc-400 font-mono tracking-widest">// CÚ PHÁP ĐIỂN HÌNH:</h4>
              <pre className="text-[11px] font-mono leading-relaxed bg-black/90 p-3 border border-brand-border text-brand-neon rounded-none overflow-x-auto">
                <code>{activeLesson.example}</code>
              </pre>
            </div>

            {/* Active Challenge Goal Instruction */}
            <div className="bg-[#111] p-4.5 border border-[#444] rounded-none space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-[11px] uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-brand-neon shrink-0 animate-bounce" />
                <span>Nhiệm vụ của bạn</span>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                {activeLesson.exercise}
              </div>
            </div>

          </div>

          {/* Bottom Lesson Navigation controls */}
          <div className="p-4 border-t border-brand-border bg-brand-dark shrink-0 flex items-center justify-between select-none">
            <button
              onClick={prevLesson}
              disabled={activeLessonIdx === 0}
              className="px-3 py-1.5 bg-[#111] hover:bg-zinc-800 disabled:opacity-30 border border-brand-border text-xs text-zinc-350 cursor-pointer font-bold font-mono uppercase tracking-wider flex items-center gap-1 transition-colors hover:text-brand-neon"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>TRƯỚC</span>
            </button>

            <div className="flex gap-1">
              {currentLessons.map((les, i) => (
                <button
                  key={les.id}
                  onClick={() => setActiveLessonIdx(i)}
                  className={`w-5 h-5 rounded-none border text-[9px] font-mono text-center font-bold transition-all ${
                    i === activeLessonIdx
                      ? 'bg-brand-neon border-brand-neon text-black'
                      : completedLessons[selectedLanguage]?.includes(les.id)
                        ? 'bg-emerald-950 border-emerald-500/30 text-emerald-400'
                        : 'bg-brand-panel border-brand-border text-zinc-500 hover:text-white'
                  }`}
                >
                  {les.id}
                </button>
              ))}
            </div>

            <button
              onClick={nextLesson}
              disabled={activeLessonIdx === currentLessons.length - 1}
              className="px-3 py-1.5 bg-[#111] hover:bg-zinc-800 disabled:opacity-30 border border-brand-border text-xs text-zinc-350 cursor-pointer font-bold font-mono uppercase tracking-wider flex items-center gap-1 transition-colors hover:text-brand-neon"
            >
              <span>SAU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* RIGHT COMPARTMENT: Live sandbox editor & terminal verification */}
        <div className="lg:col-span-7 bg-brand-panel border border-brand-border flex flex-col justify-between h-[620px] shadow-[4px_4px_0_#000000] overflow-hidden">
          
          {/* Header Info */}
          <div className="bg-brand-dark px-5 py-3 border-b border-brand-border flex items-center justify-between select-none shrink-0 text-white text-xs font-mono">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-zinc-400">
              <Terminal className="w-4 h-4 text-brand-neon" />
              <span>Interactive Sandbox // Thử Nghiệm Tức Thì</span>
            </div>
          </div>

          {/* Input text-area editor */}
          <div className="flex-1 bg-black p-4 font-mono text-xs flex relative min-h-0">
            {/* Static line numbering spacer */}
            <div className="w-8 border-r border-[#222] select-none text-[9.5px] pr-2.5 text-zinc-600 font-mono text-right space-y-1 py-1 block opacity-60">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="// Lập trình mã hàm giải thuật dựa theo hướng dẫn nhiệm vụ..."
              className="flex-1 px-4 py-1 w-full h-full bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed tracking-wide caret-brand-neon overflow-y-auto"
            />
          </div>

          {/* Verification output drawer */}
          <div className="bg-brand-dark border-t border-brand-border h-40 shrink-0 flex flex-col p-4 space-y-3 bg-[#0a0a0a]">
            
            {/* Verification menu header */}
            <div className="flex items-center justify-between border-b border-brand-border pb-2 shrink-0 select-none">
              <span className="text-[10px] uppercase font-bold font-mono text-zinc-500 tracking-wider">
                Kết Quả Biên Dịch & Kiểm Thử
              </span>

              <button
                onClick={handleRunVerify}
                className="bg-brand-neon text-black font-black text-[10.5px] uppercase tracking-wider px-4 py-1.5 rounded-none transition-all flex items-center gap-1.5 cursor-pointer hover:bg-white shrink-0 shadow-[2px_2px_0_#000]"
              >
                <Play className="w-3.5 h-3.5 text-black" />
                <span>Chạy kiểm thử</span>
              </button>
            </div>

            {/* Run Logs display */}
            <div className="flex-1 bg-black p-3.5 font-mono text-[10.5px] overflow-y-auto rounded-none border border-brand-border flex flex-col justify-between">
              <div>
                <span className={`font-black uppercase tracking-wider text-[9px] mr-1.5 ${
                  validationResult.status === 'success' ? 'text-emerald-450 text-[#00FF66]' :
                  validationResult.status === 'failed' ? 'text-red-400' :
                  'text-zinc-500'
                }`}>
                  {validationResult.status === 'success' ? '● THÀNH CÔNG:' :
                   validationResult.status === 'failed' ? '● CẤU TRÚC LỖI:' :
                   '● TRẠNG THÁI:'}
                </span>
                <span className="text-zinc-300 leading-relaxed">
                  {validationResult.message}
                </span>
              </div>

              {validationResult.output && (
                <div className="mt-2 text-[9.5px] bg-brand-dark/40 border-t border-brand-border p-1 text-zinc-500 uppercase tracking-wide">
                  // KẾT QUẢ ĐẦU RA / RETURN VALUE: <span className="font-bold text-white lowercase">{validationResult.output}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Graduation Reward Box (Full Completed Celebrations) */}
      {doneCount === currentLessons.length && (
        <div className="bg-gradient-to-r from-emerald-950/40 to-brand-panel border-2 border-emerald-500/40 p-6 shadow-[4px_4px_0_#000000] text-center space-y-3 rounded-none animate-bounce">
          <Award className="w-12 h-12 text-brand-neon mx-auto animate-pulse" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Chúc Mừng Bạn Đã Tốt Nghiệp Khóa Học Nhập Môn!</h3>
          <p className="text-zinc-300 text-xs font-mono max-w-lg mx-auto">
            Bạn đã xuất sắc hoàn thành trọn vẹn lớp huấn luyện rèn luyện dẻo dai cơ bản ({doneCount}/{currentLessons.length} bài thành công). Bạn đã đủ phong độ tự tin để bắt đầu thực chiến các bài tập LeetCode thực tế ở tab "Kho Bài Tập LeetCode" rồi đó!
          </p>
        </div>
      )}

    </div>
  );
}
