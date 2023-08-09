function isAllHabitable(grid) {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const row = grid.length;
  const column = grid[0].length;
  let days = 0;

  // 检查是否所有的可改造区都已经变成宜居区
  function checkAllHabitable() {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (grid[i][j] === 'NO') {
          return false;
        }
      }
    }
    return true;
  }

  // 执行宜居改造
  function transform() {
    const queue = [];
    let count = 0;

    // 将所有已经完成宜居改造的区域加入队列
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (grid[i][j] === 'YES') {
          queue.push([i, j]);
        }
      }
    }

    // 使用广度优先搜索进行宜居改造
    while (queue.length > 0) {
      const size = queue.length;

      for (let i = 0; i < size; i++) {
        const [x, y] = queue.shift();

        // 向四个方向扩散改造
        for (const [dx, dy] of directions) {
          const newX = x + dx;
          const newY = y + dy;

          // 检查是否越界或已经改造过
          if (
            newX >= 0 &&
            newX < row &&
            newY >= 0 &&
            newY < column &&
            grid[newX][newY] === 'NO'
          ) {
            grid[newX][newY] = 'YES';
            queue.push([newX, newY]);
            count++;
          }
        }
      }

      // 如果没有新的区域进行改造，则退出循环
      if (count === 0) {
        break;
      } else {
        days++;
        count = 0;
      }
    }
  }

  transform();

  return checkAllHabitable() ? days : -1;
}

// 测试样例
const grid1 = [
  ['YES', 'YES', 'NO'],
  ['NO', 'NO', 'NO'],
  ['NA', 'NO', 'YES']
];
console.log(isAllHabitable(grid1)); // 输出 2

const grid2 = [
  ['YES', 'NO', 'NO', 'NO'],
  ['NO', 'NO', 'NO', 'NO'],
  ['NO', 'NO', 'NO', 'NO'],
  ['NO', 'NO', 'NO', 'NO']
];
console.log(isAllHabitable(grid2)); // 输出 6

const grid3 = [
  ['NO', 'NA']
];
console.log(isAllHabitable(grid3)); // 输出 -1

const grid4 = [
  ['YES', 'NO', 'NO', 'YES'],
  ['NO', 'NO', 'YES', 'NO'],
  ['NO', 'YES', 'NA', 'NA'],
  ['YES', 'NO', 'NA', 'NO']
];
console.log(isAllHabitable(grid4)); // 输出 -1





function removeDigits(num1, n) {
  if (n >= num1.length) {
    return '0';
  }
  
  const stack = [];
  for (let i = 0; i < num1.length; i++) {
    const digit = num1[i];
    while (stack.length > 0 && stack[stack.length - 1] > digit && n > 0) {
      stack.pop();
      n--;
    }
    stack.push(digit);
  }
  
  while (n > 0) {
    stack.pop();
    n--;
  }
  
  let result = '';
  let leadingZero = true;
  for (let i = 0; i < stack.length; i++) {
    if (leadingZero && stack[i] === '0') {
      continue;
    }
    leadingZero = false;
    result += stack[i];
  }
  
  return result || '0';
}

// 测试样例
console.log(removeDigits('2615371', 4)); // 输出: '131'


服务失效判断
function findNormalServices(dependencies, faults) {
  const dependencyMap = new Map();
  const faultSet = new Set(faults);
  const result = [];

  for (const dependency of dependencies) {
    const [service, dependencyService] = dependency.split('-');
    if (!dependencyMap.has(service)) {
      dependencyMap.set(service, []);
    }
    dependencyMap.get(service).push(dependencyService);
  }

  function dfs(service) {
    if (faultSet.has(service)) {
      return;
    }

    result.push(service);
    if (dependencyMap.has(service)) {
      for (const dependencyService of dependencyMap.get(service)) {
        dfs(dependencyService);
      }
    }
  }

  for (const service of dependencyMap.keys()) {
    dfs(service);
  }

  result.sort((a, b) => dependencies.indexOf(a + '-' + b));

  return result.length > 0 ? result.join(',') : ',';
}

// 测试样例
const dependencies = ['a1-a2', 'a5-a6', 'a2-a3'];
const faults = ['a5', 'a2'];
console.log(findNormalServices(dependencies, faults));  // 输出 "a6,a3"


方法二
function findNormalServices(dependencies, failures) {
  // 构建依赖关系图
  const graph = {};
  for (let dep of dependencies) {
    const [serviceA, serviceB] = dep.split("-");
    if (!graph[serviceA]) graph[serviceA] = [];
    graph[serviceA].push(serviceB);
  }

  // 深度优先搜索遍历所有服务，判断是否在故障列表中
  const visited = {};
  const dfs = (service) => {
    if (visited[service]) return;
    visited[service] = true;
    if (failures.includes(service)) return;
    if (!graph[service]) return;
    for (let dependency of graph[service]) {
      dfs(dependency);
    }
  };

  // 遍历所有服务
  for (let service in graph) {
    dfs(service);
  }

  // 按照依赖关系列表中的次序排序
  const result = [];
  for (let dep of dependencies) {
    const [serviceA, serviceB] = dep.split("-");
    if (visited[serviceA] && !result.includes(serviceA)) {
      result.push(serviceA);
    }
    if (visited[serviceB] && !result.includes(serviceB)) {
      result.push(serviceB);
    }
  }

  // 返回结果，用逗号分隔
  return result.join(",");
}
// 测试示例1
const dependencies1 = ["a1-a2", "a5-a6", "a2-a3"];
const failures1 = ["a5", "a2"];
console.log(findNormalServices(dependencies1, failures1)); // 输出: "a6,a3"

// 测试示例2
const dependencies2 = ["a1-a2"];
const failures2 = ["a2"];
console.log(findNormalServices(dependencies2, failures2)); // 输出: ","



找单词
function findWord(grid, word) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let result = "";

  function dfs(row, col, index) {
    // 越界或已访问过，返回false
    if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
      return false;
    }

    // 当前字符不匹配，返回false
    if (grid[row][col] !== word[index]) {
      return false;
    }

    // 当前字符匹配，且是最后一个字符，返回true
    if (index === word.length - 1) {
      return true;
    }

    // 标记当前单元格为已访问
    visited[row][col] = true;

    // 递归搜索相邻单元格
    if (
      dfs(row - 1, col, index + 1) ||
      dfs(row + 1, col, index + 1) ||
      dfs(row, col - 1, index + 1) ||
      dfs(row, col + 1, index + 1)
    ) {
      // 如果存在匹配的路径，将当前位置添加到结果中
      result += `${row},${col},`;
      return true;
    }

    // 回溯，将当前单元格标记为未访问
    visited[row][col] = false;

    return false;
  }

  // 遍历二维数组，找到匹配的起始位置
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (dfs(i, j, 0)) {
        return result.slice(0, -1); // 去掉最后一个逗号
      }
    }
  }

  return "N";
}

// 读取输入
const N = parseInt(readline());
const grid = [];
for (let i = 0; i < N; i++) {
  grid.push(readline().split(","));
}
const word = readline();

// 调用函数并输出结果
const result = findWord(grid, word);
print(result);


找出通过车辆最多颜色
function maxColorCount(colors, windowSize) {
  let maxCount = 0;
  let countMap = new Map();
  let i = 0;
  for (let j = 0; j < colors.length; j++) {
    countMap.set(colors[j], (countMap.get(colors[j]) || 0) + 1);
    if (j - i + 1 > windowSize) {
      countMap.set(colors[i], countMap.get(colors[i]) - 1);
      if (countMap.get(colors[i]) === 0) {
        countMap.delete(colors[i]);
      }
      i++;
    }
    maxCount = Math.max(maxCount, Math.max(...countMap.values()));
  }
  return maxCount;
}

// 测试示例
console.log(maxColorCount([0, 1, 1, 2], 3)); // 输出 2
console.log(maxColorCount([0, 1, 2, 1], 2)); // 输出 1






整理扑克牌
function sortPoker(numbers) {
  // 步骤1：对扑克牌进行分组
  const counts = {};
  numbers.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
  });

  const bombs = [];
  const fullHouses = [];
  const triples = [];
  const pairs = [];
  const singles = [];

  Object.keys(counts).forEach(num => {
    const count = counts[num];
    if (count >= 4) {
      bombs.push(num);
    } else if (count === 3) {
      triples.push(num);
    } else if (count === 2) {
      pairs.push(num);
    } else {
      singles.push(num);
    }
  });

  // 步骤2：对组合牌进行排序
  bombs.sort((a, b) => b - a);
  triples.sort((a, b) => b - a);
  pairs.sort((a, b) => b - a);
  singles.sort((a, b) => b - a);

  // 如果存在“葫芦”，将其拆分为“三张”和“对子”
  if (triples.length >= 2) {
    fullHouses.push(triples[0]);
    fullHouses.push(triples[1]);
    triples.splice(0, 2);
  }

  // 步骤3：对可能的组合方案进行排序并合并
  const combinations = [bombs, fullHouses, triples, pairs, singles];
  combinations.forEach(combo => {
    combo.sort((a, b) => b - a);
  });

  const sortedNumbers = [].concat(...combinations);

  return sortedNumbers;
}

// 测试示例
console.log(sortPoker([1, 3, 3, 3, 2, 1, 5])); // 输出：[3, 3, 3, 1, 1, 5, 2]
console.log(sortPoker([4, 4, 2, 1, 2, 1, 3, 3, 3, 4])); // 输出：[4, 4, 4, 3, 3, 2, 2, 1, 1, 3]
