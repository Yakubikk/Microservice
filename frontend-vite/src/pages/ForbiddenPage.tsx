import React from 'react';
import {Link} from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
    return (
        <div>
            <h1>Доступ запрещен</h1>
            <p>У вас нет прав для просмотра этой страницы.</p>
            <Link to="/">Вернуться на главную</Link>
        </div>
    );
};

export { ForbiddenPage };
export default ForbiddenPage;
