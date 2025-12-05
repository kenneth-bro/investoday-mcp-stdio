# Investoday MCP Server

Investoday 数据 API MCP 服务器 - 一个 stdio 代理，用于将 MCP 客户端（如 Cline、Claude Desktop）连接到 Investoday 的 Streamable HTTP MCP 服务。

## 特性

- 🚀 通过 `npx` **一键安装**
- 🔗 支持 **Streamable HTTP** 传输协议
- 🔐 通过 URL 参数进行 **安全的 API Key** 认证
- 🛠️ **兼容** Cline、Claude Desktop 及其他 MCP 客户端

## 安装

### 使用 npx（推荐）

无需安装，直接在 MCP 客户端中配置：

```json
{
  "mcpServers": {
    "investoday": {
      "command": "npx",
      "args": ["-y", "investoday-mcp"],
      "env": {
        "API_KEY": "你的API密钥"
      }
    }
  }
}
```

### 全局安装

```bash
npm install -g investoday-mcp
```

## 配置

### 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `API_KEY` | ✅ 是 | - | 你的 Investoday API 密钥 |
| `BASE_URL` | ❌ 否 | `https://data-api.investoday.net/data/mcp/preset` | 自定义 API 端点 |
| `DEBUG` | ❌ 否 | `false` | 启用调试日志 |

## 在 MCP 客户端中使用

### Cline (VS Code)

1. 打开安装了 Cline 扩展的 VS Code
2. 打开 Cline 设置（点击 ⋮ 菜单 → MCP Servers）
3. 编辑 MCP 设置文件，添加：

```json
{
  "mcpServers": {
    "investoday": {
      "command": "npx",
      "args": ["-y", "investoday-mcp"],
      "env": {
        "API_KEY": "你的API密钥"
      }
    }
  }
}
```

4. 保存并重启 Cline

### Claude Desktop

编辑 Claude Desktop 配置文件：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "investoday": {
      "command": "npx",
      "args": ["-y", "investoday-mcp"],
      "env": {
        "API_KEY": "你的API密钥"
      }
    }
  }
}
```

### 自定义 Base URL

如需使用自定义 API 端点：

```json
{
  "mcpServers": {
    "investoday": {
      "command": "npx",
      "args": ["-y", "investoday-mcp"],
      "env": {
        "API_KEY": "你的API密钥",
        "BASE_URL": "https://your-custom-endpoint.com/mcp"
      }
    }
  }
}
```

### 调试模式

启用调试日志以排查问题：

```json
{
  "mcpServers": {
    "investoday": {
      "command": "npx",
      "args": ["-y", "investoday-mcp"],
      "env": {
        "API_KEY": "你的API密钥",
        "DEBUG": "true"
      }
    }
  }
}
```

调试日志输出到 stderr，不会影响 MCP 通信。

## 获取 API Key

访问 [Investoday](https://data-api.investoday.net) 注册并获取你的 API 密钥。

## 系统要求

- Node.js >= 18.0.0

## 许可证

MIT
