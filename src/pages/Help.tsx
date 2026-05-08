import AppLayout from "../components/layout/AppLayout";
import Accordion from "../components/ui/Accordion";

export default function Help() {
  return (
    <AppLayout
      header={{
        title: "Franchu's Gestor de Contratos",
        tabs: ["Centro de Ayuda"],
        activeTab: "Centro de Ayuda",
      }}
    >
      <div className="space-y-8">

        {/* INTRO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7E4DD]">
          <h2 className="text-lg font-semibold mb-2">¿Qué es este sistema?</h2>
          <p className="text-sm text-gray-500">
            Este sistema permite gestionar solicitudes de personal dentro del hotel,
            incluyendo su creación, aprobación y asignación según área, cargo y turno.
          </p>
        </div>

        {/* FLUJO (ACCORDION) */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Flujo de solicitudes</h2>

          <Accordion
            items={[
              {
                title: "1. Creación de solicitud",
                content:
                  "Defines fechas, turno, área, cargo y cantidad de trabajadores.",
              },
              {
                title: "2. Aprobación",
                content:
                  "Un responsable revisa la solicitud y decide si aprobarla o rechazarla.",
              },
              {
                title: "3. Asignación",
                content:
                  "Se asignan trabajadores disponibles según el cargo requerido.",
              },
              {
                title: "4. Ejecución",
                content:
                  "Se realiza el servicio en las fechas definidas.",
              },
            ]}
          />
        </div>

        {/* CONCEPTOS (ACCORDION) */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Conceptos clave</h2>

          <Accordion
            items={[
              {
                title: "¿Qué es una solicitud?",
                content:
                  "Es un requerimiento de personal para un período específico dentro del hotel.",
              },
              {
                title: "¿Qué es un turno?",
                content:
                  "Es el bloque horario en el que se necesita el personal.",
              },
              {
                title: "¿Qué es un cargo?",
                content:
                  "Es el rol del trabajador, por ejemplo: limpieza o garzón.",
              },
              {
                title: "¿Qué es el valor hora?",
                content:
                  "Es el costo asociado a cada trabajador según su cargo.",
              },
            ]}
          />
        </div>

        {/* FAQ (ACCORDION) */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Preguntas frecuentes</h2>

          <Accordion
            items={[
              {
                title: "¿Puedo editar una solicitud?",
                content:
                  "Sí, siempre que la solicitud aún no haya sido aprobada.",
              },
              {
                title: "¿Qué pasa si no hay trabajadores disponibles?",
                content:
                  "La solicitud puede quedar pendiente o necesitar ajustes.",
              },
              {
                title: "¿Cómo se calcula el costo?",
                content:
                  "Se calcula multiplicando valor hora por horas y cantidad de trabajadores.",
              },
            ]}
          />
        </div>

      </div>
    </AppLayout>
  );
}