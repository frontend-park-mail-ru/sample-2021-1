export const RENDER_MAP = {
    DOM: 'dom',
    TMPL: 'tmpl',
}

export class BoardComponent {
    constructor({
        parent = document.body,
        data = [],
    } = {}) {
        this._parent = parent;
        this._data = data;
    }

    render({
        type = RENDER_MAP.DOM
    }) {
        switch(type) {
            case RENDER_MAP.TMPL:
                this._renderTmpl();
                break;
            case RENDER_MAP.DOM:
            default:
                this._renderDOM();
                break;
        }
    }

    _renderTmpl() {
        const template = window.fest['components/Board/Board.tmpl'](this._data);
		this._parent.innerHTML = template;
    }

    _renderDOM() {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
        <tr>
            <th>Email</th>
            <th>Age</th>
            <th>Likes</th>
        </th>
        `;
        const tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);
        table.border = 1;
        table.cellSpacing = table.cellPadding = 0;

        this._data.forEach((user) => {
            const email = user.email;
            const age = user.age;
            const score = user.score;

            const tr = document.createElement('tr');
            const tdEmail = document.createElement('td');
            const tdAge = document.createElement('td');
            const tdScore = document.createElement('td');

            tdEmail.textContent = email;
            tdAge.textContent = age;
            tdScore.textContent = score;

            tr.appendChild(tdEmail);
            tr.appendChild(tdAge);
            tr.appendChild(tdScore);

            tbody.appendChild(tr);

            this._parent.appendChild(table);
        });
    }
}
