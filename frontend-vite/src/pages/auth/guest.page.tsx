import {Link} from "react-router-dom";
import {CalendarCheck, Gauge, Train, Warehouse} from "lucide-react";
import {Button} from "@/components";
import {useAuthStore} from "@/store/authStore.ts";

const GuestPage = () => {
    const {isAuthenticated} = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col justify-between">
            {/* Hero Section */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Train className="h-8 w-8 text-blue-600"/>
                        <span className="text-2xl font-bold text-blue-800">СГ-Транс: Учет вагонов</span>
                    </div>
                    <div className="flex space-x-4">
                        {!isAuthenticated
                            ? <Link to="/login">
                                <Button variant="outline">
                                    Вход для сотрудников
                                </Button>
                            </Link>
                            : <Link to="/user">
                                <Button variant="outline">
                                    Личный кабинет
                                </Button>
                            </Link>
                        }
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Система учета подвижного состава
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Добро пожаловать в информационную систему учета и управления вагонным парком компании СГ-Транс
                    </p>
                </section>

                {/* Features Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <Warehouse className="h-6 w-6 text-blue-600 mr-3"/>
                            <h3 className="text-lg font-semibold">Учет вагонов</h3>
                        </div>
                        <p className="text-gray-600">
                            Полная информация о каждом вагоне в парке компании
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <Gauge className="h-6 w-6 text-blue-600 mr-3"/>
                            <h3 className="text-lg font-semibold">Мониторинг</h3>
                        </div>
                        <p className="text-gray-600">
                            Отслеживание местоположения и состояния вагонов в реальном времени
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <CalendarCheck className="h-6 w-6 text-blue-600 mr-3"/>
                            <h3 className="text-lg font-semibold">Планирование</h3>
                        </div>
                        <p className="text-gray-600">
                            Оптимизация использования подвижного состава
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <Train className="h-6 w-6 text-blue-600 mr-3"/>
                            <h3 className="text-lg font-semibold">Аналитика</h3>
                        </div>
                        <p className="text-gray-600">
                            Подробные отчеты и аналитические данные по работе парка
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                {!isAuthenticated && <section className="bg-blue-700 rounded-xl p-8 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Получите полный доступ к системе
                        </h2>
                        <p className="mb-6 text-blue-100">
                            Авторизуйтесь в системе для работы с полным функционалом учета и управления вагонным парком
                        </p>
                        <Link to="/login">
                            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                                Войти в систему
                            </Button>
                        </Link>
                    </div>
                </section>}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-4">
                        <Train className="h-6 w-6 text-blue-400 mr-2"/>
                        <span className="font-medium">СГ-Транс</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Система учета вагонного парка. Все права защищены.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export {GuestPage};
export default GuestPage;
