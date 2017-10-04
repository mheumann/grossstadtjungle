import { Question } from './classes/question';
import * as L from 'leaflet';
export var QUESTIONS: Question[] = [
    {
        id: 0,
        tourId: 0,
        latLng: L.latLng(49.483994, 8.475750),
        place: 'Wasserturm',
        intro: 'Der Wasserturm verfügt über eine "Aussichtsplattform". Blickt man mittig von dieser Aussichtsplattform aus in Richtung Wassertreppe, ist eine Laterne zu sehen, deren Fuß hinter einer Skulptur fußt.',
        question: 'Welchen Titel trägt sie?',
        answers: ['das rad', 'rad'],
        hint: 'Der Bildhauer war Morice Lipsi (Tafel vor Ort)',
        trivia: 'Zwischen 1886 und 1889 wurde der 60 Meter hohe Turm (der Durchmesser liegt bei 19 Metern) nach Plänen von Gustav Halmhuber gebaut. Tatsächlich hatte er ursprünglich alle Funktionen der Trinkwasserversorgung zu erfüllen.'
    }, {
        id: 1,
        tourId: 0,
        latLng: L.latLng(49.4831, 8.462),
        place: 'Schloss Mannheim',
        intro: 'Obwohl es selbst nicht in den Quadraten liegt sind diese zum Schloss hin ausgerichtet. Auf dem Schlossplatz sind zwei Denkmäler zu sehen (Karl Friedrich und Karl Ludwig).',
        question: 'Welche Jahreszahl haben die Kunsthalle Mannheim und die Skulptur Karl Friedrichs gemeinsam?',
        answers: ['1907'],
        hint: 'Vergleicht man die Inschriften auf der Rückseite beider Skulpturen, findet man bei Karl Friedrich eine Jahreszahl mehr.',
        trivia: 'Unter anderem beherbergt das Schloss Mannheim aktuell die Universitätsbibliothek, Seminarräume und Vorlesungssäle der Mannheimer Universität.'
    }, {
        id: 2,
        tourId: 0,
        latLng: L.latLng(49.486409, 8.462112),
        place: 'Schillerplatz',
        intro: 'Zwischen dem Mannheimer Schloss und dem Museum Zeughaus (in D5) befindet sich eine Grünanlage, benannt nach dem deutschen Dichter, Philosoph und Historiker: Friedrich Schiller.',
        question: 'Welches 1778 eröffnete Haus, das hier an diesem Ort stand, war ein Geschenk des Kurfürsten Karl Theodors, nachdem er Bayern erbte?',
        answers: ['das nationaltheater', 'nationaltheater', 'theater'],
        hint: 'Das gesuchte Bauwerk war unter anderem dazu da, Stücke von Dichtern, wie z.B. Friedrich Schiller aufführen zu können.',
        trivia: 'Im Jahr 1782 wurde an diesem Ort Friedrich Schillers "Die Räuber" uraufgeführt.'
    }, {
        id: 3,
        tourId: 0,
        latLng: L.latLng(49.4899,8.4623),
        place: 'Friedensengel',
        intro: 'An den Mannheimer Planken und in der Nähe des Rathauses befindet sich die Skulptur des Friedensengels. Sie soll an Opfer des Regimes des 3. Reiches erinnern.',
        question: 'Welcher Bundeskanzler weihte den Friedensengel ein?',
        answers: ['konrad adenauer', 'adenauer'],
        hint: 'Meist werden bedeutende Ereignisse fotographisch festgehalten',
        trivia: 'Konrad Adenauer selbst weihte das Mahnmal 1952 ursprünglich im Quadrat B4 ein. Erst 1983 versetzte man es zum heutigen Standort neben dem Rathaus.'
    }, {
        id: 4,
        tourId: 0,
        latLng: L.latLng(49.4898,8.4652),
        place: 'Hauptsynagoge',
        intro: 'Nähe der aktuellen Synagoge (F3) Mannheims und nicht weit vom Marktplatz entfernt befand sich die Hauptsynagoge der judischen Gemeinde.',
        question: 'Welcher Art von Angriff zerstörte im Zweiten Weltkrieg neben Sprengladungen die Synagoge',
        answers: ['ein luftangriff', 'luftangriff', 'bomben'],
        hint: 'Es war kein Bodenangriff, sondern ...',
        trivia: 'Nach der Machtergreifung der Nationalsozialisten wurde, während der Novemberprogrome 1938, von SA-Männern erstmals die Einrichtung zerstört, Feuer gelegt und Sprengstoff gezündet. Im darauffolgenden Jahr wurde die jüdische Gemeinde dann dazu gezwungen sie an die Stadverwaltung zu "verkaufen".'
    }, {
        id: 5,
        tourId: 0,
        latLng: L.latLng(49.4896,8.4675),
        place: 'Marktplatz',
        intro: 'An der Kurpfalzstarße liegend wird der Mannheimer Marktplatz vom Marktplatzbrunnen geschmückt. Merkur, welcher auf diesem Brunnen sogar die Stadtgöttin Mannhemia(Mannheimia) überragt, hält in einer Hand den Hermesstab.',
        question: 'Was hält Merkur in der anderen Hand?',
        answers: ['eine sonne', 'die sonne', 'sonne'],
        hint: 'Der Stern, der in unserem Sonnensystem im Zentrum steht.',
        trivia: 'Der Namensgebung entsprechend ist der Marktplatz nach wie vor Veranstaltungsort für Mannheimer Wochenmärkte: Dienstag und Donnerstag 08:00 bis 14:00 Uhr bzw. Samstag 08:00 bis 15:00 Uhr. Ebenso kann man täglich Zeuge eines Glockenspiels des Glockenturms vor Ort werden: um 07:45 Uhr, 11:45 Uhr und 17:45 Uhr.'
    }, {
        id: 6,
        tourId: 0,
        latLng: L.latLng(49.48741, 8.4673),
        place: 'Mahnmal',
        intro: 'Bei den Mannheimer Planken, der zentralen Einkaufsstraße Mannheims wurde für jüdische Opfer des Nationalsozialismus ein Mahnmal errichtet. Auf diesem wurden in Spiegelschrift mehr als 2200 Opfer eingraviert.',
        question: 'Wie viele Seiten des Mahnmals wurden mit Inschriften versehen?',
        answers: ['4', 'vier'],
        hint: 'Das Mahnmal ist ein Kubus',
        trivia: 'Der Kubus, der vom Bildhauer Jochen Kitzbihler angefertigt wurde, ist schräg zum Paradeplatz ausgerichtet und weist eine Kantenlänge von insgesamt 3 Metern auf. Eingeweiht wurde er am 25. November 2003.'
    },
];