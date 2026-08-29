type WidgetConfig = { portalUrl: string; color: string; product?: string };
type Article = {
  id: string;
  title: string;
  contentHtml?: string;
  question?: string;
  answer?: string;
};

const script = document.currentScript as HTMLScriptElement | null;
const config: WidgetConfig = {
  portalUrl: script?.dataset.portalUrl ?? new URL('./', document.baseURI).origin,
  color: script?.dataset.color ?? '#14532d',
  product: script?.dataset.product,
};

function apiUrl(path: string) {
  return `${config.portalUrl.replace(/\/$/, '')}/api${path}`;
}

class SupportWidget {
  private readonly root: ShadowRoot;
  private readonly panel: HTMLElement;
  private readonly body: HTMLElement;
  private chatToken = localStorage.getItem('open-support-widget-token');
  private chatId = localStorage.getItem('open-support-widget-chat');

  constructor() {
    const host = document.createElement('div');
    host.setAttribute('data-open-support-widget', '');
    this.root = host.attachShadow({ mode: 'open' });
    document.body.append(host);
    this.root.innerHTML = `<style>
      :host{all:initial;font-family:system-ui,-apple-system,sans-serif;color:#18181b}*{box-sizing:border-box}.launcher{position:fixed;right:24px;bottom:24px;border:0;border-radius:999px;background:${config.color};color:#fff;width:54px;height:54px;cursor:pointer;font-size:24px;box-shadow:0 5px 18px #0003}.panel{display:none;position:fixed;right:24px;bottom:90px;width:min(380px,calc(100vw - 32px));height:min(600px,calc(100vh - 120px));background:#fff;border:1px solid #d4d4d8;border-radius:12px;box-shadow:0 12px 35px #0003;overflow:hidden}.panel.open{display:flex;flex-direction:column}.head{background:${config.color};color:#fff;padding:16px;font-weight:700;display:flex;justify-content:space-between}.close{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}.tabs{display:flex;border-bottom:1px solid #e4e4e7}.tab{flex:1;border:0;background:#fff;padding:11px;cursor:pointer}.tab.active{color:${config.color};border-bottom:2px solid ${config.color};font-weight:700}.body{padding:14px;overflow:auto;flex:1}.search,input,textarea{width:100%;border:1px solid #d4d4d8;border-radius:6px;padding:10px;font:inherit}.search{margin-bottom:12px}.article{display:block;width:100%;text-align:left;background:#fff;border:0;border-bottom:1px solid #e4e4e7;padding:12px 2px;cursor:pointer}.article b{display:block}.muted{color:#71717a;font-size:13px}.messages{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}.msg{padding:9px 11px;border-radius:9px;background:#f4f4f5;max-width:85%;font-size:14px}.msg.visitor{align-self:flex-end;background:#dcfce7}.form{display:flex;flex-direction:column;gap:8px}.send{background:${config.color};color:#fff;border:0;border-radius:6px;padding:10px;cursor:pointer}.row{display:flex;gap:8px}.row input{flex:1}
    </style><button class="launcher" aria-label="Open support">?</button><section class="panel" aria-label="Support"><header class="head">Open Support <button class="close" aria-label="Close">×</button></header><nav class="tabs"><button class="tab active" data-tab="home">Home</button><button class="tab" data-tab="ask">Ask</button></nav><main class="body"></main></section>`;
    this.panel = this.root.querySelector('.panel')!;
    this.body = this.root.querySelector('.body')!;
    this.root.querySelector('.launcher')!.addEventListener('click', () => {
      this.panel.classList.toggle('open');
      if (this.panel.classList.contains('open')) this.home();
    });
    this.root
      .querySelector('.close')!
      .addEventListener('click', () => this.panel.classList.remove('open'));
    this.root
      .querySelectorAll<HTMLElement>('[data-tab]')
      .forEach((tab) => tab.addEventListener('click', () => this.selectTab(tab)));
  }

  private selectTab(tab: HTMLElement) {
    this.root
      .querySelectorAll('.tab')
      .forEach((item) => item.classList.toggle('active', item === tab));
    tab.dataset.tab === 'ask' ? this.ask() : this.home();
  }

  private async home() {
    this.body.innerHTML =
      '<input class="search" placeholder="Search support articles"/><div class="results"><span class="muted">Loading answers…</span></div>';
    const search = this.body.querySelector<HTMLInputElement>('.search')!;
    const results = this.body.querySelector<HTMLElement>('.results')!;
    const load = async () => {
      const query = search.value.trim();
      const params = new URLSearchParams({ limit: '8' });
      if (query) params.set('query', query);
      if (config.product) params.set('productId', config.product);
      const response = await fetch(apiUrl(`/knowledgebase/articles?${params}`));
      const data = (await response.json()) as { items?: Article[]; results?: Article[] };
      const articles = data.items ?? data.results ?? [];
      results.innerHTML = articles.length
        ? articles
            .map(
              (article) =>
                `<button class="article" data-id="${article.id}"><b>${escapeHtml(article.title)}</b><span class="muted">Read article →</span></button>`,
            )
            .join('')
        : '<span class="muted">No matching articles.</span>';
      results
        .querySelectorAll<HTMLElement>('[data-id]')
        .forEach((item) => item.addEventListener('click', () => this.article(item.dataset.id!)));
    };
    search.addEventListener('input', () => void load());
    await load().catch(() => {
      results.innerHTML = '<span class="muted">Support articles are unavailable.</span>';
    });
  }

  private async article(id: string) {
    this.body.innerHTML = '<span class="muted">Loading article…</span>';
    const article = (await (
      await fetch(apiUrl(`/knowledgebase/articles/${id}`))
    ).json()) as Article;
    this.body.innerHTML = `<button class="article back">← All answers</button><h2>${escapeHtml(article.title)}</h2><div>${safeHtml(article.contentHtml ?? article.answer ?? article.question ?? '')}</div>`;
    this.body.querySelector('.back')!.addEventListener('click', () => this.home());
  }

  private ask() {
    if (this.chatId && this.chatToken) return void this.messages();
    this.body.innerHTML =
      '<form class="form"><p>Ask the support team a question.</p><input name="name" placeholder="Your name" required/><input name="email" type="email" placeholder="Email" required/><textarea name="message" placeholder="How can we help?" required></textarea><button class="send">Start chat</button></form>';
    this.body.querySelector('form')!.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget as HTMLFormElement);
      void this.startChat(
        String(form.get('name')),
        String(form.get('email')),
        String(form.get('message')),
      );
    });
  }

  private async startChat(name: string, email: string, message: string) {
    const response = await fetch(apiUrl('/chats'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        visitorName: name,
        visitorEmail: email,
        message,
        meta: { currentPage: location.href, language: navigator.language },
      }),
    });
    const data = (await response.json()) as { chat: { id: string }; token: string };
    this.chatId = data.chat.id;
    this.chatToken = data.token;
    localStorage.setItem('open-support-widget-chat', this.chatId);
    localStorage.setItem('open-support-widget-token', this.chatToken);
    this.messages();
  }

  private async messages() {
    const response = await fetch(apiUrl(`/chats/visitor/${this.chatId}?token=${this.chatToken}`));
    const chat = (await response.json()) as {
      messages: { id: string; sender: string; content: string }[];
    };
    this.body.innerHTML = `<div class="messages">${chat.messages.map((message) => `<div class="msg ${message.sender}">${escapeHtml(message.content)}</div>`).join('')}</div><form class="row"><input placeholder="Write a reply…" required/><button class="send">Send</button></form>`;
    this.body.querySelector('form')!.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = this.body.querySelector('input')!;
      void fetch(apiUrl('/chats/messages'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: this.chatToken, content: input.value }),
      }).then(() => this.messages());
    });
  }
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  );
}
function safeHtml(value: string) {
  const template = document.createElement('template');
  template.innerHTML = value;
  template.content.querySelectorAll('script,style,iframe,object').forEach((node) => node.remove());
  return template.innerHTML;
}

new SupportWidget();
